#!/usr/bin/env python
# Name: Jerinca Vreugdenhil
# Student number: 12405965
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=" \
             "feature&release_date=" \
             "2008-01-01,2018-01-01&num_votes=5000,&sort=" \
             "user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # selects all the movies as a list and put them in a container
    container_films = dom.findAll("div", {"class": "lister-item-content"})

    # create space for list with data
    movie_data = []

    # for every film in the container
    for film in container_films:

        # take in name and append
        movie_name = film.a.get_text()
        movie_data.append(movie_name)

        # take in rating and append
        movie_rating = film.div.div.strong.get_text()
        movie_data.append(movie_rating)

        # find where year is located
        find_year = film.find("span", {"class":
                              "lister-item-year text-muted unbold"})

        # get year and append
        space_split = find_year.get_text().split()

        # for every year in splitted list
        for year in space_split:

            # strip for parentheses
            movie_year = year.strip("()")

            # if an element is numeric
            if (movie_year.isnumeric()):

                # append to movie data
                movie_data.append(movie_year)

        # get to the part wher the stars and direcors are hiding
        container_stars_directors = film.findAll("p", {"class": ""})

        # create space list actors
        movie_persons = []

        # for every person as actor or director
        for person in container_stars_directors:

            # find lines for every movie
            movie_person = person.findAll("a")

            # to get to name, get text from every line of that movie
            for name in movie_person:

                # get name and append
                movie_person_name = name.get_text()

                # append names to each other
                movie_persons.append(movie_person_name)

                # create seperator
                seperator = ","

                # join them as a string
                joined_movie_persons = seperator.join(movie_persons)

        # append the names per movie
        movie_data.append(joined_movie_persons)

        # find where runtime is located
        find_runtime = film.find("span", {"class": "runtime"})

        # get run time and append
        movie_runtime = find_runtime.get_text().strip("min")
        movie_data.append(movie_runtime)

    # return all the data of the movie as a list
    return movie_data


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # set counter to 0
    counter = 0

    # for every item in data
    for item in range(len(movies) // 5):

        # write down information of the movie
        writer.writerow([movies[counter],
                         movies[counter + 1],
                         movies[counter + 2],
                         movies[counter + 3],
                         movies[counter + 4]])

        # go to next movie
        counter += 5

    # close file again
    outfile.close()


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during'
              'HTTP GET request to {0} : {1}'
              .format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)