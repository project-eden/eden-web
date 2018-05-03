# Utility functions for processing and querying data.
import numpy as np
import pandas as pd
import math

# Returns the closes point that exists in the given table to the given coordinates.

def find_value_for_point(x, y, df):
    closest_x = df.iloc[(np.abs(df['x'] - x)).idxmin()]['x']
    closest_y = df.iloc[(np.abs(df['y'] - y)).idxmin()]['y']
    return df[(df['x'] == closest_x) & (df['y'] == closest_y)]

# Returns a list of the n most produced crops for the given point.
# Returns it as a list of n triples, for each triple:
# - First item is a tuple containing the name of the crop.
# - Seond item is a float value representing the production of the above crop at given point.

def top_n_crops_produced_at_point(x, y, n, df):
    # Don't report the latitute, longitude or bioClim variables as crops.
    columns_to_ignore = ['x', 'y', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19']
    # Get the cell corresponding to the point. In the Data, x and y are flipped so flip them
    cell = find_value_for_point(y, x, df)
    if (cell.empty):
        return []
    # Ignore values given columns
    cell = cell[cell.columns.difference(columns_to_ignore)]
    best_crops = cell.sort_values(by=cell.index[0], ascending=False, axis=1).iloc[:,0:n]
    top_n = []
    for column in best_crops:
        crop = best_crops[column]
        crop_name = crop.name
        value = round(crop.values[0], 3)
        if (value != 0 and (not math.isnan(value))):
            top_n.append((crop_name, value))
    return top_n

# Returns a list of the n most productive cells for the given crop.
# Returns it as a list of n triples, for each triple:
# - First item is a tuple containing the Latitude/Longitude of the point.
# - Seond item is a float value representing the production of the input crop at above point.

def top_n_production_points_for_crop(crop_name, n, df):
    best_cells = df.loc[df[crop_name].nlargest(n).index]
    top_n = []
    for index, cell in best_cells.iterrows():
        # Round coordinates to match Lat/Long format
        x = round(cell['x'], 6)
        y = round(cell['y'], 6)
        value = round(cell[crop_name], 4)
        bundle = ((y, x), value)
        top_n.append(bundle)
    return top_n

# Returns a list of coordinate that were originially zero or NaN for the given crop but we predict more value.

def interesting_points(crop_name, n, actual, predicted):
    # Get coordinates from actual where value for given crop was zero or NaN.
    was_originally_zero_or_nan = actual.loc[((actual[crop_name] == 0) | (str(actual[crop_name]) == str(np.nan)))]
    # Interesting if actual was 0 or NaN but predicted is not.
    is_interesting = was_originally_zero_or_nan.loc[(predicted[crop_name] > 0)][['x', 'y', crop_name]]

    interesting_predictions = predicted[predicted.index.isin(is_interesting.index)][['x', 'y', crop_name]]

    return interesting_predictions


# Returns a list of all coordinate pairs in the given table.

def coordinates(df):
    xs = df['x'].tolist()
    ys = df['y'].tolist()
    coordinate_pairs = []
    for x, y in zip(xs, ys):
        coordinate_pairs.append([x, y])
    return coordinate_pairs
