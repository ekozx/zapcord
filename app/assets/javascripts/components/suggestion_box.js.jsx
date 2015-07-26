var SuggestionListItem = React.createClass({
  quickAdd: function(e) {
    console.log(e);
  },
  render: function() {
    return (
      <li><a href='#' onClick={this.quickAdd}>
      {this.props.suggestionData['title']}
      </a></li>
    );
  }
});

var SuggestionList = React.createClass({
  render: function() {
    var suggestionList = [];
    function iterateSuggestions(suggestions) {
      for(var suggestionIndex in suggestions) {
        suggestionList.push(<SuggestionListItem suggestionData={suggestions[suggestionIndex]} />)
      }
    }
    iterateSuggestions(this.props.suggestionList);
    return <ul className='suggestion-list'>{suggestionList}</ul>;
  }
});

var GuessListItem = React.createClass({
  quickSuggestion: function(e) {
    var rtId = this.props.movieData['rotten_tomatoes_id'];
    var imdbId = this.props.movieData['imdb_id'];
    if (rtId !== null) {
      $.get('/rt_suggestion/rt/' + rtId, function(data) {
        this.props.suggest(data["movies"]);
      }.bind(this));
    } else if (imdbId !== null) {
      $.get('/rt_suggestion/imdb/' + imdbId, function(data) {
        this.props.suggest(data["movies"]);
      }.bind(this));
    }
  },
  render: function() {
    return (
      <li><a href='#' onClick={this.quickSuggestion}>
      {this.props.movieData['title']}
      </a></li>
    );
  }
});

var GuessList = React.createClass({
  render: function() {
    function iterateData(data, suggestFunction) {
      items = [];
      for(var index in data) {
        items.push(<GuessListItem movieData={data[index]} suggest={suggestFunction}/>);
      }
    }
    iterateData(this.props.guessList, this.props.suggest);
    return <ul className='guess-list'>{items}</ul>;
  }
});

var SuggestionBox = React.createClass({
  getInitialState: function() {
    return{text: '', data: {}, suggestions: []};
  },
  suggestionFunc: function(suggstionList) {
    this.setState({suggestions: suggstionList});
  },
  onChange: function(e) {
    var txt = e.target.value;
    url = "/search/entries/" + txt  + "/no";
    if (url === '/search/entries//no') {
      this.setState({data: {}, text: txt});
    }
    $.get(url, function(data){
      this.setState({data: data, text: txt});
    }.bind(this));
  },
  handleSubmit: function(e) {
    e.preventDefault();
  },
  render: function() {
    return (
      <div>
        <div className="col-lg-6" >
          <h3>Suggestions</h3>
          <form className=''>
            <input onChange={this.onChange} value={this.state.text} />
            <button className="btn-suggest" onClick={this.suggestionClick}>
              {'Suggestions based on ' + (this.state.text)}
            </button>
          </form>
          <br></br>
          <GuessList guessList={this.state.data} suggest={this.suggestionFunc} />
        </div>
        <div className="col-lg-6">
          <SuggestionList suggestionList={this.state.suggestions} />
        </div>
      </div>
    );
  }
});
