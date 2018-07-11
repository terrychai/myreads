import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookShelfList from './components/BookShelfList';
import SearchBooks from './components/SearchBooks'
import {Route} from 'react-router-dom'

class BooksApp extends React.Component {
    constructor(args) {
      super(args);
      this.state = {
          books: []
      }
  }

  componentDidMount() {
      BooksAPI.getAll().then(books => {
          this.setState({books: books})
      })
  }

  onShelfChange = (book, shelf) => {     
    book.shelf = shelf;        
    BooksAPI.update(book, shelf)
    .then(  
        this.state.books.filter(b => b.id === book.id ).length > 0 ?            
        this.setState((state) => ({
            books: state.books.map(b => {
                if (b.id === book.id) {                          
                    b.shelf = shelf;
                    return b
                } else {
                    return b
                }
            })
        })) : this.setState((state) => ({
            books: state.books.concat([book])})
    ))              
  };

  render() {
      const state = this.state;
      const currentlyReading = state.books.filter((book) => book.shelf === 'currentlyReading')
      const wantToRead = state.books.filter((book) => book.shelf === 'wantToRead')
      const read = state.books.filter((book) => book.shelf === 'read')      
      console.log(this.state.books)
      console.log(this.state.books.filter((book) => book.shelf === 'currentlyReading'));
      return (
          <div className="app">
              <Route path="/" exact render={() => (
                  <div>
                      <div className="list-books-title">
                          <h1>MyReads</h1>
                      </div>
                      <BookShelfList
                            currentlyReading={currentlyReading}
                            wantToRead={wantToRead}
                            read={read}
                            onShelfChange={this.onShelfChange}
                        />
                  </div>
              )}/>
              <Route path="/search" render={({history}) => (
                  <SearchBooks
                      onShelfChange={this.onShelfChange}
                      history={history}
                      books={this.state.books}
                  />
              )}/>
          </div>
      )
  }
}

export default BooksApp
