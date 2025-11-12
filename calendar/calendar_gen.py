import datetime
import calendar

def generate_calendar_html(year=2025):
    """
    Generates a full-year, bi-weekly view calendar as an HTML file.

    Args:
        year (int): The year for which to generate the calendar.
    """

    # --- Configuration ---
    CELL_HEIGHT = 55  # in pixels, for watermark positioning

    # Colors for each month
    MONTH_COLORS = [
        "#FFCCCC", "#FFDDCC", "#FFEECC", "#FFFFCC", "#EEFFCC", "#DDFFCC",
        "#CCFFCC", "#CCFFDD", "#CCFFEE", "#CCFFFF", "#CCEEFF", "#CCDDFF"
    ]

    # --- Date Calculation ---
    # Set the week to start on Monday
    calendar.setfirstweekday(calendar.MONDAY)

    # Find the first day to display on the grid (must be a Monday)
    first_day_of_year = datetime.date(year, 1, 1)
    days_to_subtract = first_day_of_year.weekday()
    grid_start_date = first_day_of_year - datetime.timedelta(days=days_to_subtract)

    # Find the last day to display on the grid (must be a Sunday)
    last_day_of_year = datetime.date(year, 12, 31)
    days_to_add = 6 - last_day_of_year.weekday()
    grid_end_date = last_day_of_year + datetime.timedelta(days=days_to_add)

    # Generate a list of all dates to be displayed
    all_dates = []
    current_date = grid_start_date
    while current_date <= grid_end_date:
        all_dates.append(current_date)
        current_date += datetime.timedelta(days=1)

    # --- HTML and CSS Generation ---

    # CSS Styles
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
            grid-template-columns: repeat(14, 1fr); /* Two weeks per row */
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
            font-size: 0.9rem;
            font-weight: 500;
            color: #555;
            position: relative;
            z-index: 2;
        }}
        .weekend .day-number {{
            font-weight: 700;
            color: #333;
        }}
        /* Monthly background colors */
        {''.join([f'.month-{i+1} {{ background-color: {color}; }}' for i, color in enumerate(MONTH_COLORS)])}
        .month-watermark {{
            position: absolute;
            width: 100%;
            text-align: center;
            font-size: 8rem;
            font-weight: 700;
            color: rgba(180, 180, 200, 0.15);
            z-index: 1;
            pointer-events: none; /* Allows text selection through the watermark */
            text-transform: uppercase;
            line-height: 1;
        }}
    </style>
    """

    # --- Generate Calendar Grid and Watermarks ---
    html_cells = []
    month_watermark_positions = {}

    for i, date in enumerate(all_dates):
        row_index = i // 14  # Two weeks per row

        # Determine month color class
        month_class = f"month-{date.month}"

        # Determine if it's a weekend for bolding
        weekend_class = "weekend" if date.weekday() >= 5 else ""

        # Store the row index for the 15th of each month for watermark positioning
        if date.day == 15:
            month_watermark_positions[date.month] = row_index

        cell_html = f"""
        <div class="day-cell {month_class} {weekend_class}">
            <span class="day-number">{date.day}</span>
        </div>
        """
        html_cells.append(cell_html)

    html_watermarks = []
    for month_num, row_idx in month_watermark_positions.items():
        month_name = calendar.month_abbr[month_num]
        # Adjust top position to better center the large font over the two-week block
        top_position = (row_idx * CELL_HEIGHT) - (CELL_HEIGHT * 0.5) 

        watermark_html = f"""
        <div class="month-watermark" style="top: {top_position}px;">
            {month_name}
        </div>
        """
        html_watermarks.append(watermark_html)

    # --- Assemble Final HTML ---
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
                {"".join(html_watermarks)}
                <div class="calendar-grid">
                    {"".join(html_cells)}
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    # --- Write to File ---
    filename = f"calendar_{year}.html"
    with open(filename, "w") as f:
        f.write(final_html)

    print(f"Successfully generated calendar: {filename}")


if __name__ == "__main__":
    generate_calendar_html(2025)