#!/usr/bin/env python
# Name: Jerinca Vreugdenhil
# Student number: 12405965
"""
This script visualizes data obtained from a .csv file
"""
import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# open csv
with open(INPUT_CSV) as csvfile:

	# read file 
	filereader = csv.DictReader(csvfile)

	# for every row in file
	for row in filereader:

		# get rating from row
		rating = row.get('Rating')

		# grab year from row and append
		year = data_dict[row['Year']].append(rating)

	# create space for list years
	list_years = []

	# create space for average ratings
	average_rating = []

	# for every year in dictionary
	for key in data_dict:

		# append year
		list_years.append(int(key))

		# counter
		space = 0
		
		# get values from dictionary
		values = data_dict.get(key)
		
		# for every value in values from dict
		for value in values:

			# sum them up
			space += float(value)
		
		# divide them by total amount of ratings
		average = space / len(values) 

		# append them to a list
		average_rating.append(average) 	

	# if graph is being plotted use this style
	plt.style.use('seaborn-whitegrid')

	# x axes is years y axes is rating
	plt.plot(list_years, average_rating, 'c')

	# start and end values
	plt.axis([START_YEAR, END_YEAR, 0, 10])

	# set title
	plt.title("The Movie-Rator")

	# label y axes
	plt.ylabel('Average movie ratings')

	# labe x axes
	plt.xlabel('Year')

	# open plot
	plt.show()

	# close file again
	INPUT_CSV.close()


if __name__ == "__main__":
	print(data_dict)
