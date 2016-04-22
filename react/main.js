var React = require('react');
var ReactDOM = require('react-dom');

const JobList = React.createClass({
  getInitialState: function() {
    return {jobs: []};
  },
  componentDidMount: function() {
    var self = this;
    $.ajax({
      method: "GET",
      url: "/api/v1/jobs"
    })
    .done(function(jobsDB){
      self.setState({jobs: jobsDB});
    });
  },
  render: function() {
    if (this.state.jobs.docs != undefined) {
      var allJobs = this.state.jobs.docs.map(function(job){
        return <JobItem link={job.link} title={job.title} company={job.company} postedAt={job.createdAt} key={job._id} />
      })
    }
    return <div>{allJobs}</div>
  }
})

const JobItem = React.createClass({
  render: function(){
  return <div className="job">
    <h3><a href={this.props.link}>{this.props.title}</a></h3>
    <p>at <strong>{this.props.company}</strong>, posted at {this.props.postedAt}</p>
    <button className="edit">Edit</button>
    <button className="delete">Delete</button>
  </div>
  }
});

ReactDOM.render(<JobList />, document.getElementById('jobs-container'));
