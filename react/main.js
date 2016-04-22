var React = require('react');
var ReactDOM = require('react-dom');

const App = React.createClass({
  render: function() {
    return <div id="wrapper">
    <JobSearch />
    <JobList />
    </div>
  }
})

const JobSearch = React.createClass({
  render: function() {
    return <div id="jobsearch">
      <form action="">
      <input type="search" id="search-title" placeholder="Search by Title" />
      <input type="search" id="search-company" placeholder="Search by Company" />
      Sort by:
      <select id="sort">
        <option value="">Choose...</option>
        <option value="createdAt">Created At</option>
        <option value="title">Title</option>
        <option value="company">Company</option>
      </select>
    </form>
    </div>
  }
})

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
      self.setState({jobs: jobsDB.docs});
    });
  },
  addJob: function(e) {
    e.preventDefault();
    var self = this;

    $.ajax({
      method: 'POST',
      url: '/api/v1/jobs',
      data: {
        job: {title: self.state.newTitle, link: self.state.newLink, company: self.state.newCompany}
      }
    })
    .done(function(newJob) {
      const allJobs = self.state.jobs;
      allJobs.pop();
      allJobs.unshift(newJob);
      self.setState({jobs: allJobs, newTitle: '', newLink: '', newCompany: ''});
    });
  },
  titleChange: function(e) {
    this.setState({newTitle: e.target.value});
  },
  linkChange: function(e) {
    this.setState({newLink: e.target.value});
  },
  companyChange: function(e) {
    this.setState({newCompany: e.target.value});
  },
  render: function() {
    var allJobs = this.state.jobs.map(function(job){
      return <JobItem link={job.link} title={job.title} company={job.company} postedAt={job.createdAt} key={job._id} id={job._id} />
    })
    return <div id="job-add-list">
      <form onSubmit={this.addJob}>
        <input type="text" onChange={this.titleChange} value={this.state.newTitle} placeholder="Job Title" />
        <input type="text" onChange={this.linkChange} value={this.state.newLink} placeholder="URL" />
        <input type="text" onChange={this.companyChange} value={this.state.newCompany} placeholder="Company" />
        <button type="submit" id="add-job">Add a Job</button>
      </form>
      {allJobs}
    </div>
  }
})

const JobItem = React.createClass({
  getInitialState: function(){
    return {visible: ""};
  },

  delete: function(){
    var self = this;
    $.ajax({
      method: "DELETE",
      url: "/api/v1/jobs/" + self.props.id
    })
    .done(function(){
      self.setState({ visible: "hide" });
    });
  },

  render: function(){
  return <div className={ `job ${this.state.visible}` }>
    <h3><a href={this.props.link}>{this.props.title}</a></h3>
    <p>at <strong>{this.props.company}</strong>, posted at {this.props.postedAt}</p>
    <button className="edit">Edit</button>
    <button className="delete" onClick={this.delete}>Delete</button>
  </div>
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
