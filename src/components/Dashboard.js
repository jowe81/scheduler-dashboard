import React, { Component } from "react";
import Loading from "./Loading";
import Panel from "./Panel";
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";

 import classnames from "classnames";
import axios from "axios";


const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];

class Dashboard extends Component {

  state = { 
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {},
  };

  selectPanel(id) {
    this.setState(prev => ({
      focused: prev.focused ? null : id
    }));
  }

  
  componentDidMount() {
    //Initialize state after mounting with locally stored state if present
    const focused = JSON.parse(localStorage.getItem("focused"));
    if (focused) {
      this.setState({focused});
    }

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });    
  }

  //Store new state if it changed during update
  componentDidUpdate(prevProps, prevState) {
    if (prevState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  render() {
    console.log(this.state);
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });

    if (this.state.loading) {
      return <Loading />;
    }

    const panels = data
      .filter(panel => this.state.focused === null || this.state.focused === panel.id)
      .map(panel => 
        <Panel 
          key={panel.id} 
          label={panel.label}
          value={panel.getValue(this.state)}
          onSelect={event => this.selectPanel(panel.id)}>
        </Panel>);

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
