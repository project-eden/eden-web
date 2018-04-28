# Utility functions for processing and querying data.
import numpy as np
import pandas as pd

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
    # Get the cell corresponding to the point. In the Data, x and y are flipped so flip'em
    cell = find_value_for_point(y, x, df)
    if (cell.empty):
        return None
    # Ignore values for column, row, x, y for the query.
    cell = cell[cell.columns.difference(['x', 'y'])]
    best_crops = cell.sort_values(by=cell.index[0], ascending=False, axis=1).iloc[:,0:n]
    top_n = []
    for column in best_crops:
        crop = best_crops[column]
        crop_name = crop.name
        value = round(crop.values[0], 3)
        if (value != 0):
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
