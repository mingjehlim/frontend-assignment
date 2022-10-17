import React, { Fragment, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CircularProgress from '@mui/material/CircularProgress';

// Static test data
let book_data = [
    {
        "name": "book_name",
        "author": "author_value",
        "borrower": [
            "top_1_borrower_value", 
            "top_2_borrower_value", 
            "top_3_borrower_value"
        ]   
    },
    {
        "name": "book_name",
        "author": "author_value",
        "borrower": [
            "top_1_borrower_value", 
            "top_2_borrower_value", 
            "top_3_borrower_value"
        ]   
    },
    {
        "name": "book_name",
        "author": "author_value",
        "borrower": [
            "top_1_borrower_value", 
            "top_2_borrower_value", 
            "top_3_borrower_value"
        ]   
    }
];

let country_data = 
    {
        "country" : {
            "full_name": "Singapore",
            "country_code": "SG"
        }
    }
;

// Change endpoint domain here
const endpoint = "https://fakerapi.it/api/v1"; 

class BookList extends React.Component {  
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            countryCode: "SG",
            isLoading: true,
            active: -1
        };
        this.onToggle = this.onToggle.bind(this);
    }

    getRequest = (event) => {
        this.setState({ 
            isLoading: true, 
            active: -1
        });

        // Get country 
        fetch(endpoint + "/books?_quantity=1")
            .then(res => res.json())
            .then((result) => {
                // Uncomment to throw error
                // throw Error('Simulate getRandomCountry error');
                console.log("Get country successful " + result.data[0].author);
                
                this.setState({ 
                    // countryCode: result.data[0].author // Get from API
                    countryCode: country_data.country.country_code // Get test data
                    }, this.getData())
            })
            .catch((error) => {
                console.log(error);
                this.setState({ isLoading: false, data: [] }); 
            });
    }

    getData = () => {
        // Get data 
        fetch(endpoint + "/books?_quantity=" + this.state.countryCode.length)
            .then(res => res.json())
            .then(
                (result) => {
                    // Uncomment to throw error
                    // throw Error('Simulate getTop5ReadBook error');
                    
                    this.setState({
                        // data: result, // Get from API
                        data: book_data, // Get test data
                        isLoading: false
                    });
                })
            .catch((error) => {
                console.log(error);
                this.setState({ isLoading: false, data: [] }); 
            });
    }

    onToggle = (id) => {
        this.setState({ active: id });
    };

    componentDidMount() {
        this.getRequest();
    }

    render() {
        const data = this.state.data;
        let content;

        if (data && data.length > 0 && !this.state.isLoading) {
            content = data.map((data, index) => 
                <Fragment>
                    <BookItem index={index} data={this.state.data} onToggle={this.onToggle} active={index === this.state.active} />
                    

                </Fragment>
            )
        }
        else {
            content = <div id="error-message">No data found</div>
        }

        return (
            <Fragment>
                <button id="action-btn" onClick={(e) => this.getRequest(e)}>Get country: {this.state.countryCode}</button>
                <div id="container">
                    { this.state.isLoading? <CircularProgress /> : content }
                </div>
            </Fragment>
            );
    }
}

class BookItem extends React.Component {
    constructor(props) {
        super(props);
        this.toggleChild = this.toggleChild.bind(this);
        this.state =  {
            isExpanded: this.props.active
        };
    }
    
    toggleChild(index) {
        // call parent component to change props
        this.props.onToggle(index);
    }

    // DEPRECATED method: When props change for active item [use getDerivedStateFromProps]
    // componentWillReceiveProps(nextProps) {
    //     this.setState({
    //         isExpanded: nextProps.active? !this.state.isExpanded : false
    //     });
    // }

    static getDerivedStateFromProps(props, state) {
        return {
          isExpanded: props.active? !state.isExpanded : false
        };
    }

    render() {
        let i = this.props.index;
        
        return (
            <Fragment>
                <div id={"book-item-" + (i + 1)}>
                    <div className="book-item-detail">
                        <div>{i + 1}</div>
                        <div className="book-name">{this.props.data[i].name}</div>
                        <i className={"fa book-toggle fa-chevron-" + (this.state.isExpanded ? 'down' : 'up')} onClick={() => this.toggleChild(i)} />
                    </div>
                    <div className="book-item-footnote">
                        <div className="book-author">by {this.props.data[i].author}</div>
                    </div>
                </div>
                <div className="book-borrowers">
                    {
                        this.state.isExpanded &&
                        this.props.data[i].borrower
                            .map((data, index) => 
                            <BookBorrowerItem key={index} data={data} />
                    )}
                </div>
            </Fragment>
        );
    }
}

class BookBorrowerItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="borrower">{this.props.data}</div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<BookList />);