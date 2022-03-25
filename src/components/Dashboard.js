import React, { Component } from "react";
import Loading from "./Loading";
import Panel from "./Panel";

import classnames from "classnames";


const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {

  state = { 
    loading: false,
    focused: null,
  };

  selectPanel(id) {
    this.setState(prev => ({
      focused: prev.focused ? null : id
    }));
  }

  //Initialize state after mounting with locally stored state if present
  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({focused});
    }
  }

  //Store new state if it changed during update
  componentDidUpdate(prevProps, prevState) {
    if (prevState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  render() {

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
          {...panel}
          onSelect={event => this.selectPanel(panel.id)}>
        </Panel>);

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
