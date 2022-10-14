# Test cases

### Case 1 
### Book container
- Book container border is 1px solid rgb(0, 0, 0)
- Book container width is 500px
- book container height is less than browser viewport height after expanding the content

### Book items and child
- Book count is 3
- Book element width and height is 409px x 108px
- Only 1 book item can be expanded at once, with 3 childs max
- Child width and height is 331px x 79px

### Case 2
### Refresh button 
- Text value contains "Get country: "
- Position from left and top is 25px
- Calls 2 APIs on click (getRandomCountry and getTop5ReadBook) and render new data (3 books with 3 customers each)

### Case 3
### Error message
- Error message is displayed if API returns no data or has error
- Error message text value is "No data found"