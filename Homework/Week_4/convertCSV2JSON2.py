#!/usr/bin/env python
# Name: Jerinca Vreugdenhil
# Student number: 12405965
"""
This script reads in a csv file
https://opendata.cbs.nl/statline/#/CBS/nl/dataset/83933NED/table?dl=B00D

"""
import csv
import pandas as pd

file = pd.read_csv('Hoogopgeleidden.csv')
