import datetime
import calendar

def generate_calendar_html(year=2025):
    """
    Generates a full-year, bi-weekly view calendar as an HTML file.
    Month markers are positioned next to the exact cell that contains the 1st day of each month.
    """

    # --- Configuration ---
    CELL_HEIGHT = 55  # in pixels, for vertical positioning
    CELL_PADDING_LEFT = 6  # small pixel nudge to move marker inside the cell

    # Colors for each month
    MONTH_COLORS = [
        "#FFCCCC", "#FFDDCC", "#FFEECC", "#FFFFCC", "#EEFFCC", "#DDFFCC",
        "#CCFFCC", "#CCFFDD", "#CCFFEE", "#CCFFFF", "#CCEEFF", "#CCDDFF"
    ]

    # --- Date Calculation ---
    calendar.setfirstweekday(calendar.MONDAY)

    first_day_of_year = datetime.date(year, 1, 1)
    days_to_subtract = first_day_of_year.weekday()
    grid_start_date = first_day_of_year - datetime.timedelta(days=days_to_subtract)

    last_day_of_year = datetime.date(year, 12, 31)
    days_to_add = 6 - last_day_of_year.weekday()
    grid_end_date = last_day_of_year + datetime.timedelta(days=days_to_add)

    all_dates = []
    current_date = grid_start_date
    while current_date <= grid_end_date:
        all_dates.append(current_date)
        current_date += datetime.timedelta(days=1)

    # --- HTML and CSS Generation ---
    css_styles = f"""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&display=swap');

        body {{
            font-family: 'Quicksand', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f8f8;
        }}
        .calendar-container {{
            display: flex;
            width: 100%;
            max-width: 1200px;
            margin: auto;
            background-color: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }}
        .year-panel {{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0 20px;
            background-color: #fdfdfd;
            border-right: 1px solid #eee;
        }}
        .year-char {{
            font-size: 4rem;
            font-weight: 700;
            color: #a0a0c0;
            line-height: 0.9;
        }}
        .calendar-wrapper {{
            position: relative; /* markers positioned relative to this */
            width: 100%;
            overflow: visible;
        }}
        .calendar-grid {{
            display: grid;
            grid-template-columns: repeat(14, 1fr);
            border-left: 1px solid #eee;
            border-top: 1px solid #eee;
            position: relative; /* Added for vertical line */
        }}

        /* Vertical divider for two weeks */
        .vertical-divider {{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 50%; /* Center divider */
            width: 2px;
            background-color: #333; /* Dark line */
            z-index: 1;
        }}

        .day-cell {{
            box-sizing: border-box;
            height: {CELL_HEIGHT}px;
            padding: 4px;
            border-right: 1px solid #eee;
            border-bottom: 1px solid #eee;
            position: relative;
        }}
        .day-number {{
            font-size: 2.0rem; /* Increased font size to fit the cell */
            font-weight: 500;
            color: #555;
            z-index: 2;
        }}
        .weekend .day-number {{
            font-weight: 700;
            color: #333;
        }}

        /* Monthly background colors */
        {''.join([f'.month-{i+1} {{ background-color: {color}; }}' for i, color in enumerate(MONTH_COLORS)])}

        /* Month markers */
        .month-marker {{
            position: absolute;
            font-size: 0.95rem;
            font-weight: 700;
            background-color: rgba(0,0,0,0.07);
            padding: 4px 8px;
            display: inline-block;
            border-radius: 6px;
            z-index: 5;
            transform: translateY(6px); /* slight vertical offset to sit within the cell */
            white-space: nowrap;
        }}
    </style>
    """

    # --- Calendar Grid and Month Markers ---
    html_cells = []
    # store mapping: month -> (absolute_index_in_all_dates, row_index, col_index)
    month_first_cell_info = {}

    for i, date in enumerate(all_dates):
        row_index = i // 14
        col_index = i % 14

        month_class = f"month-{date.month}"
        weekend_class = "weekend" if date.weekday() >= 5 else ""

        # Record the exact cell index for the 1st day of each month
        if date.day == 1:
            month_first_cell_info[date.month] = (i, row_index, col_index)

        cell_html = f"""
        <div class="day-cell {month_class} {weekend_class}">
            <span class="day-number">{date.day}</span>
        </div>
        """
        html_cells.append(cell_html)

    # Build the marker HTML using the exact column (col_index) and row (row_index).
    # left is calculated relative to grid width using CSS calc with column index.
    html_markers = []
    for month_num, (abs_idx, row_idx, col_idx) in month_first_cell_info.items():
        month_name = calendar.month_abbr[month_num]
        # top in px based on rows
        top_px = row_idx * CELL_HEIGHT
        # left: place at the left edge of the target column (use calc so it scales with grid)
        # add a small pixel nudge so it sits nicely inside the cell
        left_calc = f"calc({col_idx} * (100% / 14) + {CELL_PADDING_LEFT}px)"
        marker_html = f"""
        <div class="month-marker" style="top: {top_px}px; left: {left_calc};">
            {month_name}
        </div>
        """
        html_markers.append(marker_html)

    year_panel_html = "".join([f'<div class="year-char">{char}</div>' for char in str(year)])

    final_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{year} Calendar</title>
        {css_styles}
    </head>
    <body>
        <div class="calendar-container">
            <div class="year-panel">
                {year_panel_html}
            </div>
            <div class="calendar-wrapper">
                <div class="vertical-divider"></div> <!-- Added vertical divider -->
                {"".join(html_markers)}
                <div class="calendar-grid">
                    {"".join(html_cells)}
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    filename = f"calendar_{year}.html"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(final_html)

    print(f"Successfully generated calendar: {filename}")


def generate_weekly_calendar_html(year=2025):
    """
    Generates a full-year calendar with each week on one row as an HTML file.

    Args:
        year (int): The year for which to generate the calendar.
    """

    # --- Configuration ---
    CELL_HEIGHT = 40  # Smaller cell height for weekly view
    WEEK_FONT_SIZE = "0.8rem"  # Smaller font size for dates

    # Colors for each month
    MONTH_COLORS = [
        "#FFCCCC", "#FFDDCC", "#FFEECC", "#FFFFCC", "#EEFFCC", "#DDFFCC",
        "#CCFFCC", "#CCFFDD", "#CCFFEE", "#CCFFFF", "#CCEEFF", "#CCDDFF"
    ]

    # --- Date Calculation ---
    calendar.setfirstweekday(calendar.MONDAY)

    first_day_of_year = datetime.date(year, 1, 1)
    days_to_subtract = first_day_of_year.weekday()
    grid_start_date = first_day_of_year - datetime.timedelta(days=days_to_subtract)

    last_day_of_year = datetime.date(year, 12, 31)
    days_to_add = 6 - last_day_of_year.weekday()
    grid_end_date = last_day_of_year + datetime.timedelta(days=days_to_add)

    all_dates = []
    current_date = grid_start_date
    while current_date <= grid_end_date:
        all_dates.append(current_date)
        current_date += datetime.timedelta(days=1)

    # --- HTML and CSS Generation ---
    css_styles = f"""
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&display=swap');

        body {{
            font-family: 'Quicksand', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f8f8;
        }}
        .calendar-container {{
            display: flex;
            width: 100%;
            max-width: 1200px;
            margin: auto;
            background-color: #fff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }}
        .year-panel {{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 0 20px;
            background-color: #fdfdfd;
            border-right: 1px solid #eee;
        }}
        .year-char {{
            font-size: 4rem;
            font-weight: 700;
            color: #a0a0c0;
            line-height: 0.9;
        }}
        .calendar-wrapper {{
            position: relative;
            width: 100%;
        }}
        .calendar-grid {{
            display: grid;
            grid-template-columns: repeat(7, 1fr); /* 7 days per row */
            border-left: 1px solid #eee;
            border-top: 1px solid #eee;
        }}
        .day-cell {{
            box-sizing: border-box;
            height: {CELL_HEIGHT}px;
            padding: 4px;
            border-right: 1px solid #eee;
            border-bottom: 1px solid #eee;
            position: relative;
        }}
        .day-number {{
            font-size: {WEEK_FONT_SIZE}; /* Smaller font size for weekly view */
            font-weight: 500;
            color: #555;
            z-index: 2;
        }}
        .weekend .day-number {{
            font-weight: 700;
            color: #333;
        }}

        /* Monthly background colors */
        {''.join([f'.month-{i+1} {{ background-color: {color}; }}' for i, color in enumerate(MONTH_COLORS)])}

        /* Month markers */
        .month-marker {{
            position: absolute;
            font-size: 0.95rem;
            font-weight: 700;
            background-color: rgba(0,0,0,0.07);
            padding: 4px 8px;
            display: inline-block;
            border-radius: 6px;
            z-index: 5;
            transform: translateY(6px); /* slight vertical offset to sit within the cell */
            white-space: nowrap;
        }}
    </style>
    """

    # --- Calendar Grid and Month Markers ---
    html_cells = []
    month_first_cell_info = {}

    for i, date in enumerate(all_dates):
        row_index = i // 7
        col_index = i % 7

        month_class = f"month-{date.month}"
        weekend_class = "weekend" if date.weekday() >= 5 else ""

        if date.day == 1:
            month_first_cell_info[date.month] = (i, row_index, col_index)

        cell_html = f"""
        <div class="day-cell {month_class} {weekend_class}">
            <span class="day-number">{date.day}</span>
        </div>
        """
        html_cells.append(cell_html)

    html_markers = []
    for month_num, (abs_idx, row_idx, col_idx) in month_first_cell_info.items():
        month_name = calendar.month_abbr[month_num]
        top_px = row_idx * CELL_HEIGHT
        left_calc = f"calc({col_idx} * (100% / 7) + 6px)"
        marker_html = f"""
        <div class="month-marker" style="top: {top_px}px; left: {left_calc};">
            {month_name}
        </div>
        """
        html_markers.append(marker_html)

    year_panel_html = "".join([f'<div class="year-char">{char}</div>' for char in str(year)])

    final_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{year} Weekly Calendar</title>
        {css_styles}
    </head>
    <body>
        <div class="calendar-container">
            <div class="year-panel">
                {year_panel_html}
            </div>
            <div class="calendar-wrapper">
                {"".join(html_markers)}
                <div class="calendar-grid">
                    {"".join(html_cells)}
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    filename = f"weekly_calendar_{year}.html"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(final_html)

    print(f"Successfully generated weekly calendar: {filename}")


if __name__ == "__main__":
    for y in range(2025, 2028):
        generate_calendar_html(y)
        generate_weekly_calendar_html(y)