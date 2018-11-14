#!/usr/bin/env python
# Name: Jerinca Vreugdenhil
# Student number: 12405965
"""
This script cleans a CSV file with information about different coutries
and does some analytics, there is a txt file where you can read the
analyzis about this data set
"""

import csv
import pandas as pd
import numpy as np
from bs4 import BeautifulSoup
import matplotlib.pyplot as plt

INFORMATION = 'input.csv'

def clean_information(data):
	"""
	Opens and cleans a dataset from missing values or unknown values 
	and makes sure the we have a usable data set where we are 
	going to use the following information:
	- Country
	- Region
	- Population Density (per sq. mi.)
	- Infant mortality (per 1000 births)
	- GDP ($ per capita) dollars

	NOTE: there is a text file with the analyzis about the data
	"""

	# create a list dict
	countries = []
	
	# open csv file
	with open('input.csv') as csvfile:

		# read in file as dictionary
		datareader = csv.DictReader(csvfile)

		# for every row in data reader
		for row in datareader:

			# create space for a dictionary
			dictionary = {}

			# if value is unknown go to next country
			if row['Pop. Density (per sq. mi.)'] == 'unknown':
				continue

			if row['GDP ($ per capita) dollars'] == 'unknown':
				continue

			# if no value go to next country
			if not row['Pop. Density (per sq. mi.)']:
				continue

			# if no value go to next country	
			if not row['Infant mortality (per 1000 births)']:
				continue

			# if no value go to next country
			if not row['GDP ($ per capita) dollars']:
				continue

			# find country and strip for white space
			dictionary['Country'] = row['Country'].rstrip()

			# get region and put it in a dictionary
			dictionary['Region'] = row['Region'].rstrip()

			# add population density to dictionary
			dictionary['Pop. Density (per sq. mi.)'] = row['Pop. Density (per sq. mi.)']

			# add infant mortality to dictionary
			dictionary['Infant mortality (per 1000 births)'] = row['Infant mortality (per 1000 births)']

			# add GDP per capita to dictionary and keep only numbers
			dictionary['GDP ($ per capita) dollars'] = row['GDP ($ per capita) dollars'].split()[0]

			# append everything to a list
			countries.append(dictionary)

		return countries

def dataframe(countries):
	"""Reads in dictionary to dataframe, 
	and changes some elements to be able to work with"""

	# read in data from dictionary
	df = pd.DataFrame.from_dict(countries)

	# convert sting into float with dot instead of comma and put it back in data frame
	df['Infant mortality (per 1000 births)'] = df['Infant mortality (per 1000 births)'].str.replace(',','.').astype(float)
	df['Pop. Density (per sq. mi.)'] = df['Pop. Density (per sq. mi.)'].str.replace(',','.').astype(float)
	df['GDP ($ per capita) dollars'] = df['GDP ($ per capita) dollars'].astype(int)

	return df

def analytics(df, column):
	"""calculates descriptives"""

	# mode GDP per capita worldwide
	mode_GDP = df[column].mode()
	
	# descriptive statistics to have a quick look
	description1 = df[column].describe()

	print(mode_GDP)
	print(description1)

def plot_histogram(df):
	"""plots histograms, 1 with everything
	and the other one with an outlier removed"""

	# find the highest value in the column
	maximum_index = df['GDP ($ per capita) dollars'].idxmax()
	
	# if graph is being plotted use this style
	plt.style.use('seaborn-darkgrid')

	# plot 2 graph's in one figure
	plt.figure(1)
	plt.subplot(211)

	# plot a histogram with the GDP data and set a title, x-label, y-label
	hist_plot = df['GDP ($ per capita) dollars'].hist(bins=50)
	hist_plot.set_title('Before')
	hist_plot.set_xlabel('GDP ($ per capita) dollars')
	hist_plot.set_ylabel('Frequency')

	# Drop the maximum value and plot second gragh
	df.drop(maximum_index, inplace=True)
	plt.subplot(212)

	# plot a histogram with the GDP data and set a title, x-label, y-label
	hist_plot = df['GDP ($ per capita) dollars'].hist(bins=50)
	hist_plot.set_title('After')
	hist_plot.set_xlabel('GDP ($ per capita) dollars')
	hist_plot.set_ylabel('Frequency')
	plt.show()

	# descriptive statistics to have a quick look
	description = df['GDP ($ per capita) dollars'].describe()


def plot_boxplot(df):
	"""makes a boxplot of Infant mortality"""

	# if graph is being plotted use this style
	plt.style.use('seaborn-darkgrid')

	# create a horizontal boxplot with title and axes of infant mortality
	boxplot = df.boxplot(column='Infant mortality (per 1000 births)', vert = False, rot=90)
	boxplot.set_title('Infant Mortality')
	plt.axis([0, 200, None, None])
	plt.show()

def write_jason(df):
	""" writes the dataframe to a json file"""

	# set Country as index of dataframe
	df = df.set_index('Country')

	# write datafram to jason file 
	df = df.to_json('eda.json', orient='index')


if __name__ == "__main__":
	information = clean_information(INFORMATION)
	analyse = dataframe(information)
	analyzeGDP = analytics(analyse, 'GDP ($ per capita) dollars')
	histogram = plot_histogram(analyse)
	boxplot = plot_boxplot(analyse)
	jasonfile = write_jason(analyse)
	analyzeGDP = analytics(analyse, 'Infant mortality (per 1000 births)')
