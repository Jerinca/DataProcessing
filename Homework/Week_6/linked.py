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
import json 

INFORMATION = 'happy_ranking.csv'

# print(INFORMATION)

def open_csv(file):


	happy_information = []

	# open csv file
	with open(file) as csvfile:

		# read in file as dictionary
		datareader = csv.DictReader(csvfile)

		# for every row in data reader
		for row in datareader:

			# create space for a dictionary
			dictionary = {}

		 	# add information to dictionary
			dictionary["HPI Rank"] = float(row['\ufeff"HPI Rank"'])
			dictionary["Country"] = row["Country"]
			dictionary["Region"] = row["Region"]
			dictionary["Average Life Expectancy"] = float(row["Average Life Expectancy"])
			dictionary["Average Wellbeing(0-10)"] = float(row["Average Wellbeing(0-10)"])
			dictionary["Happy Life Years"] = float(row["Happy Life Years"])
			dictionary["Footprint(gha/capita)"] = row["Footprint(gha/capita)"]
			dictionary["Inequality of Outcomes"] = row["Inequality of Outcomes"]
			dictionary["Inequality-adjusted Wellbeing"]= float(row["Inequality-adjusted Wellbeing"])
			dictionary["Happy Planet Index"] = float(row["Happy Planet Index"])
			dictionary["GDP/capita($PPP)"] = row["GDP/capita($PPP)"]
			dictionary["Population"] = row["Population"]
			dictionary["GINI index"] = row["GINI index"]

			# append everything to a list
			happy_information.append(dictionary)

		df = pd.DataFrame.from_dict(happy_information)
		print(df)

		# set Country as index of dataframe
		df = df.set_index("HPI Rank")

		# write datafram to jason file 
		df = df.to_json('happyranking.json', orient='index')


if __name__ == "__main__":
	information = open_csv(INFORMATION)


