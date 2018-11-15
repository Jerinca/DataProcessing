#!/usr/bin/env python
# Name: Jerinca Vreugdenhil
# Student number: 12405965
"""
This script converts a CSV file with information about .......
to a json file.
https://catalog.data.gov/dataset?tags=winning
"""
import csv
import pandas as pd
import numpy as np
from bs4 import BeautifulSoup
import matplotlib.pyplot as plt

INFORMATION = 'Lottery_Mega_Millions_Winning_Numbers__Beginning_2002.csv'

print(INFORMATION)

def open_csv(file):


	winning_numbers = []

	# open csv file
	with open(file) as csvfile:

		# read in file as dictionary
		datareader = csv.DictReader(csvfile)

		# for every row in data reader
		for row in datareader:

			# create space for a dictionary
			dictionary = {}

			# add information to dictionary
			dictionary['Draw Date'] = row['Draw Date']
			dictionary['Winning Numbers'] = row['Winning Numbers']
			dictionary['Mega Ball'] = row['Mega Ball']
			dictionary['Multiplier'] = row['Multiplier']

			# append everything to a list
			winning_numbers.append(dictionary)

		return winning_numbers

def open_file(file):
	df = pd.DataFrame.from_dict(file)
	df['Mega Ball'] = df['Mega Ball'].astype(int)
	print(df)
	return df

def plot_histogram(df):

	# if graph is being plotted use this style
	plt.style.use('seaborn-darkgrid')

	# plot a histogram with the GDP data and set a title, x-label, y-label
	hist_plot = df['Mega Ball'].hist(bins=50, color = "pink")
	hist_plot.set_title('Number of megaball')
	hist_plot.set_xlabel('Megaball number')
	hist_plot.set_ylabel('Frequency')
	plt.show()

def plot_line_chart(df):

	# if graph is being plotted use this style
	plt.style.use('seaborn-darkgrid')

	x = df['Draw Date']

	y = df['Multiplier']
	plt.plot(x, y)
	plt.show()


def write_jason(df):
	""" 
	writes the dataframe to a json file
	"""
	
	# set Country as index of dataframe
	df = df.set_index('Draw Date')

	# write datafram to jason file 
	df = df.to_json('lottery.json', orient='index')


if __name__ == "__main__":
	information = open_csv(INFORMATION)
	opened = open_file(information)
	histogram = plot_histogram(opened)
	linechart = plot_line_chart(opened)
	winning = write_jason(opened)
	


