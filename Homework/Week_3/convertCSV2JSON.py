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

INFORMATION = 'AAPL.csv'

print(INFORMATION)

def open_csv(file):


	stock_information = []

	# open csv file
	with open(file) as csvfile:

		# read in file as dictionary
		datareader = csv.DictReader(csvfile)

		# for every row in data reader
		for row in datareader:

			# create space for a dictionary
			dictionary = {}

			# add information to dictionary
			dictionary['Date'] = row['Date']
			dictionary['Open'] = row['Open']
			dictionary['High'] = row['High']
			dictionary['Low'] = row['Low']
			dictionary['Close'] = row['Close']
			dictionary['Adj Close'] = row['Adj Close']
			dictionary['Volume'] = row['Volume']

			# append everything to a list
			stock_information.append(dictionary)

		return stock_information

def open_file(file):
	df = pd.DataFrame.from_dict(file)
	df['Close'] = df['Close'].astype(float)
	return df

def plot_histogram(df):

	# if graph is being plotted use this style
	plt.style.use('seaborn-darkgrid')

	# plot a histogram with the GDP data and set a title, x-label, y-label
	hist_plot = df['Close'].hist(bins=50, color = "pink")
	hist_plot.set_title('Closing price AAPL stock')
	hist_plot.set_xlabel('Date')
	hist_plot.set_ylabel('Frequency')
	plt.show()

def plot_line_chart(df):

	# if graph is being plotted use this style
	plt.style.use('seaborn-darkgrid')

	x = df['Date']

	y = df['Close']
	plt.plot(x, y)
	plt.show()


def write_jason(df):
	""" 
	writes the dataframe to a json file
	"""
	
	# set Country as index of dataframe
	df = df.set_index('Date')

	# write datafram to jason file 
	df = df.to_json('appleclose.json', orient='index')


if __name__ == "__main__":
	information = open_csv(INFORMATION)
	opened = open_file(information)
	histogram = plot_histogram(opened)
	linechart = plot_line_chart(opened)
	winning = write_jason(opened)
	


