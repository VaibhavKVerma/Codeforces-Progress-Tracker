import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./components/home";
import Table from "./components/table";
import request from "./components/request";
import NavBar from "./components/navBar";
import PieLang from "./components/langPie";
import BarProblems from "./components/probBar";
import PieVerdict from "./components/verdictPie";
import DoughnutTags from "./components/tagsDoughnut";
import RenderList from "./components/renderList";
import SubNav from "./components/subNav";
import LoadingScreen from "./components/loading";
import { ToastContainer, toast } from "react-toastify";
import { withRouter } from "react-router-dom";

class GetHandle extends Component {
  state = {
    userName: "",
    tuser: "",
    submissions: [],
    contests: [],
    userInfo: [],
    show: false,
    otherRoutes: false,
    searchedBefore: false,
    suser: "",
    suserName: "",
    ssubmissions: [],
    scontests: [],
    suserInfo: [],
    data: "",
  };

  //For comparison
  secondUserData = async () => {
    try {
      const rData = await request(this.state.suser);
      this.setState({
        ssubmissions: rData[0],
        scontests: rData[1],
        suserInfo: rData[2],
        suserName: this.state.suser,
      });
    } catch (ex) {
      toast.error(`Invalid Username : ${this.state.suser}`);
    }
  };

  // For Bar chart
  getUnsolvedProblems = () => {
    const submissions = this.state.submissions
      .filter((c) => c.verdict !== "OK")
      .map((c) => c.id);
    console.log(submissions);
    return submissions;
  };

  // For Language Pie chart
  programLang = () => {
    const plang = this.state.submissions.map((p) => p.programmingLanguage);
    let counts = {};
    for (let i = 0; i < plang.length; i++) {
      let num = plang[i];
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    return counts;
  };

  // For Bar chart
  probIndex = (data) => {
    const submissions = data.filter((c) => c.verdict === "OK");
    const pindex = submissions.map((p) => p.problem.index);
    let counts = {};
    for (let i = 0; i < pindex.length; i++) {
      let num = pindex[i];
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    // console.log(counts);
    return counts;
  };

  // For Verdict Pie chart
  programVerdict = () => {
    const pverdict = this.state.submissions.map((p) => p.verdict);
    let counts = {};
    for (let i = 0; i < pverdict.length; i++) {
      let num = pverdict[i];
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    return counts;
  };

  probUnsolved = () => {
    const submissions = this.state.submissions;
    const unsolvedmap = new Map();
    for (const itr of submissions) {
      if (itr.verdict !== "OK") {
        const contestId = itr.contestId,
          index = itr.problem.index;
        unsolvedmap.set(
          `${contestId}-${index}`,
          `https://codeforces.com/contest/${contestId}/problem/${index}`
        );
      }
    }
    for (const itr of submissions) {
      if (itr.verdict === "OK") {
        const contestId = itr.contestId,
          index = itr.problem.index;
        if (unsolvedmap.get(`${contestId}-${index}`)) {
          unsolvedmap.delete(`${contestId}-${index}`);
        }
      }
    }
    return unsolvedmap;
  };

  probRatings = (data) => {
    const submissions = data;
    const solved = new Map();
    for (const itr of submissions) {
      if (itr.verdict === "OK") {
        solved.set(
          `${itr.problem.contestId}-${itr.problem.index}`,
          itr.problem.rating
        );
      }
    }
    const arr = {};
    solved.forEach((key, value) => {
      if (key) {
        arr[key] = arr[key] ? arr[key] + 1 : 1;
      }
    });
    return arr;
  };
  // Tags for Doughnut
  programtags = (data) => {
    let tags = data.map((p) => p.problem.tags);
    tags = [].concat.apply([], tags);
    let counts = {};
    for (let i = 0; i < tags.length; i++) {
      let num = tags[i];
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    return counts;
  };

  onChange = (e) => {
    this.setState({ tuser: e });
  };

  componentDidMount() {
    // Session will be having data only if the user has
    // searched before.
    if (sessionStorage.getItem("searchedBefore") === "true") {
      const submissions = JSON.parse(sessionStorage.getItem("submissions"));
      const contests = JSON.parse(sessionStorage.getItem("contests"));
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      const userName = sessionStorage.getItem("userName");
      const otherRoutes =
        sessionStorage.getItem("otherRoutes") === "false" ? false : true;
      this.setState({
        submissions,
        contests,
        userInfo,
        userName,
        otherRoutes,
      });
    }
  }

  componentDidUpdate(properties, prevprops) {
    if (this.state.suserName !== prevprops.suserName) {
      this.setState({
        data: (
          <div>
            <Table
              user={this.state.suserName}
              submissions={this.state.ssubmissions}
              contests={this.state.scontests}
              userInfo={this.state.suserInfo}
            />
            <div>
              <BarProblems
                data={this.probIndex(this.state.ssubmissions)}
                height={"100%"}
                width={"40vw"}
              />
            </div>
            <div>
              <BarProblems
                data={this.probRatings(this.state.ssubmissions)}
                height={"100%"}
                width={"40vw"}
              />
            </div>
            <div>
              <DoughnutTags
                data={this.programtags(this.state.ssubmissions)}
                display={false}
                width={"100%"}
              />
            </div>
          </div>
        ),
      });
    }
  }

  onSubmit = async () => {
    this.setState({ show: true });
    try {
      const rData = await request(this.state.tuser);
      console.log(rData);
      this.setState({
        submissions: rData[0],
        contests: rData[1],
        userInfo: rData[2],
        userName: this.state.tuser,
        show: false,
        otherRoutes: true,
      });

      // sessionStorage.setItem("submissions", JSON.stringify(rData[0]));
      // sessionStorage.setItem("contests", JSON.stringify(rData[1]));
      // sessionStorage.setItem("userInfo", JSON.stringify(rData[2]));
      // sessionStorage.setItem("userName", this.state.tuser);
      // sessionStorage.setItem("show", "false");
      // sessionStorage.setItem("otherRoutes", "true");
      // sessionStorage.setItem("searchedBefore", "true");
      // this.setState({ searchedBefore: true });
    } catch (ex) {
      this.setState({ show: false });
      toast.error(`Invalid Username : ${this.state.tuser}`);
    }
  };

  otherRoutes = () => {
    if (this.props.location.pathname === "/") return null;
    if (this.props.location.pathname === "/compare") {
      return (
        <div style={{ display: "flex" }}>
          <div
            className="col-md-4 col-xs-12 alig"
            style={{ flex: "5", marginTop: "38px" }}
          >
            <Table
              user={this.state.userName}
              submissions={this.state.submissions}
              contests={this.state.contests}
              userInfo={this.state.userInfo}
            />
            <div>
              <BarProblems
                data={this.probIndex(this.state.submissions)}
                height={"100%"}
                width={"40vw"}
              />
            </div>
            <div>
              <BarProblems
                data={this.probRatings(this.state.submissions)}
                height={"100%"}
                width={"40vw"}
              />
            </div>
            <div>
              <DoughnutTags
                data={this.programtags(this.state.submissions)}
                display={false}
                width={"100%"}
              />
            </div>
          </div>
          <div style={{ flex: "5" }}>
            <div style={{ display: "flex" }}>
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Search username"
                onChange={(e) =>
                  this.setState({ suser: e.currentTarget.value })
                }
              />
              <button
                className="search btn my-2 my-sm-0"
                onClick={() => {
                  this.secondUserData();
                }}
              >
                Search
              </button>
            </div>
            {this.state.data}
          </div>
        </div>
      );
    }
    if (!this.state.otherRoutes) return null;
    console.log(this.state);
    return (
      <div className="row above">
        <div className="col-md-4 col-xs-12 alig">
          <Table
            user={this.state.userName}
            submissions={this.state.submissions}
            contests={this.state.contests}
            userInfo={this.state.userInfo}
          />
        </div>
        <div className="col-md-8 col-xs-12">
          <SubNav />
          <Switch>
            <Route
              exact
              path="/lang"
              render={() => <PieLang data={this.programLang()} />}
            />
            <Route
              exact
              path="/category"
              render={() => (
                <BarProblems data={this.probIndex(this.state.submissions)} />
              )}
            />
            <Route
              exact
              path="/verdict"
              render={() => <PieVerdict data={this.programVerdict()} />}
            />
            <Route
              exact
              path="/tags"
              render={() => (
                <DoughnutTags
                  data={this.programtags(this.state.submissions)}
                  display={true}
                />
              )}
            />
            <Route
              exact
              path="/unsolved"
              render={() => <RenderList data={this.probUnsolved()} />}
            />
            <Route
              exact
              path="/ratings"
              render={() => (
                <BarProblems data={this.probRatings(this.state.submissions)} />
              )}
            />
          </Switch>
        </div>
      </div>
    );
  };

  redirectFromHome = () => {
    if (this.state.otherRoutes) return <Redirect from="/" to="/lang" />;
  };

  redirectHome = () => {
    if (this.state.otherRoutes) return <Redirect to="/" />;
  };

  renderNavBar = () => {
    if (this.state.otherRoutes && !(this.props.location.pathname === "/")) {
      return <NavBar onChange={this.onChange} onSubmit={this.onSubmit} />;
    } else
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="/">
            CodeForces Progress Tracker
          </a>
        </nav>
      );
  };

  render() {
    if (this.state.show)
      return (
        <div>
          {this.renderNavBar()}
          <div className="container lmar">
            <LoadingScreen show={this.state.show} />
          </div>
        </div>
      );
    return (
      <div>
        {this.renderNavBar()}
        <div className="container lmar">
          <ToastContainer />
          <Route
            path="/"
            exact
            render={() => (
              <Home onChange={this.onChange} onSubmit={this.onSubmit} />
            )}
          />
          {this.redirectFromHome()}
          {this.otherRoutes()}
        </div>
      </div>
    );
  }
}

export default withRouter(GetHandle);
