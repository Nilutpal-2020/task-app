import React, {Component} from 'react';
import {paths} from "../../paths";
import './Task.css'

import { Report } from "../Report/Report";

export class Task extends Component {
    constructor(props) {
        super(props);
        this.dragItem = React.createRef(null)
        this.dragOverItem = React.createRef(null)

        this.state = {
            tasks: [],
            prevTasks: [],
            taskId: 0,
            title: "",
            subTasks: [],
            sub_title: "",
            icon_url: "",
            link: "",
            note: "",
            date: "",
            index: 0,
            completed: false,
            sub_completed: false,
            years: [],
            months: [],
            dates: {}
        }
    }

    getTasks() {
        fetch(paths.API_URL + "/")
            .then(res => res.json())
            .then(data => {
                this.setState({tasks: data});
                if (this.state.tasks) {
                    let newTasks = [...this.state.tasks];
       
                    let dates = newTasks.map(task => task.date)

                    const months_str = {
                        "01": "January",
                        "02": "Feburary",
                        "03": "March",
                        "04": "April",
                        "05": "May",
                        "06": "June",
                        "07": "July",
                        "08": "August",
                        "09": "September",
                        "10": "October",
                        "11": "November",
                        "12": "December"
                    }
       
                    let years = []
                    let months = []
                    let todo_dates = []
       
                    for (let i in dates) {
                        let year = dates[i].substring(0, 4)
                        let month = dates[i].substring(5, 7)
                        if (!years.includes(year)) {
                            years.push(year)        
                        }
                        if (!months.includes(months_str[month])) {
                            months.push(months_str[month])
                        }

                        let todo_date = dates[i].substring(0, 10);

                        if (!Object.keys(todo_dates).includes(todo_date)) {
                            todo_dates[todo_date] = 1;
                        } else {
                            todo_dates[todo_date] += 1;
                        }
                    }
       
                    this.setState({
                        years: years,
                        months: months,
                        dates: todo_dates
                    })
               }
            }, (err) => {
                alert("No Tasks Found!");
            })
    }

    componentDidMount(){
        this.getTasks();
    }

    handleSort = () => {
        let _items = [...this.state.tasks];

        const draggedItems = _items.splice(this.dragItem.current, 1)[0];

        _items.splice(this.dragOverItem.current, 0, draggedItems);

        this.dragItem.current = null;
        this.dragOverItem.current = null;

        this.setState(
            {tasks: _items}
        ); 
    }

    addSubTasks() {
        let _subtask = {
            sub_title: this.state.sub_title,
            icon_url: this.state.icon_url,
            link: this.state.link,
            sub_completed: false
        };

        let _allsubtasks = [...this.state.subTasks];

        _allsubtasks.push(_subtask);

        this.setState({
            subTasks: _allsubtasks,
            sub_title: "",
            icon_url: "",
            link: "",
            sub_completed: false
        });
    }

    changeSubTitle = (e) => {
        this.setState({sub_title: e.target.value})
    }

    changeIconUrl = (e) => {
        this.setState({icon_url: e.target.value})
    }

    changeLink = (e) => {
        this.setState({link: e.target.value})
    }

    changeTitle = (e) => {
        this.setState({title: e.target.value})
    }

    changeDate = (e) => {
        this.setState({date: e.target.value})
    }

    changeNote = (e) => {
        this.setState({note: e.target.value})

    }

    addClick() {
        this.setState({
            taskId: 0,
            title: "",
            note: "",
            date: "",
            subTasks: [],
            sub_title: "",
            icon_url: "",
            link: "",
            completed: false
        })
    }

    editClick(t) {
        this.setState({
            taskId: t._id,
            title: t.title,
            note: t.note,
            date: t.date.substring(0, 10),
            subTasks: t.subTasks,
        })
    }

    changeCompleted(task, subtask) {
        console.log(task._id, subtask._id === undefined);
        let newTasks = [...this.state.tasks];

        if (subtask._id === undefined) {
            let newTask = newTasks.find((newTask) => newTask._id === task._id)
    
            newTask.completed = !newTask.completed;
        } else {
            let newTask = newTasks.find((newTask) => newTask._id === task._id)

            let newSubTasks = [...newTask.subTasks]

            let newSubTask = newSubTasks.find((sub) => sub._id === subtask._id);

            newSubTask.sub_completed = !newSubTask.sub_completed;

            // console.log(newTask, newSubTasks, newSubTask);
        }

        this.setState({
            tasks: newTasks
        })

        fetch(paths.API_URL + '/update/' + task._id, {
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                taskId: task._id,
                title: task.title,
                note: task.note,
                date: task.date,
                subTasks: task.subTasks,
                completed: task.completed
            })
        })
        .then(res => res.json())
        .then((result) => {
            this.getTasks();
        }, (err) => {
            alert("Failed");
        })
    }

    postTasks() {
        fetch(paths.API_URL + '/add', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                title: this.state.title,
                note: this.state.note,
                date: this.state.date,
                subTasks: this.state.subTasks,
                completed: this.state.completed
            })
        })
        .then(res => res.json())
        .then((result) => {
            alert(result);
            this.getTasks();
        }, (err) => {
            alert("Failed");
        })
    }

    updateTasks(id) {
        fetch(paths.API_URL + '/update/' + id, {
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                taskId: this.state.taskId,
                title: this.state.title,
                note: this.state.note,
                date: this.state.date.substring(0, 10),
                subTasks: this.state.subTasks,
                completed: this.state.completed
            })
        })
        .then(res => res.json())
        .then((result) => {
            alert(result);
            this.getTasks();
        }, (err) => {
            alert("Failed");
        })
    }
    
    deleteClick(id) {
        if (window.confirm("Are you sure? ")) {
            fetch(paths.API_URL + "/delete/" + id, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                }
            })
            .then(res => res.json())
            .then((result) => {
                alert(result);
                this.getTasks();
            }, (err) => {
                alert("Failed");
            })
        }
    }

    toggleOptions(e, option) {
        let toggleList = [...this.state.tasks];

        if (option === "Y") {
            toggleList = toggleList.filter((task) => task.date.substring(0, 4) === e);
        } else if (option === "M") {
            const months_str = {
                "January": "01",
                "Feburary": "02",
                "March": "03",
                "April": "04",
                "May": "05",
                "June": "06",
                "July": "07",
                "August": "08",
                "September": "09",
                "October": "10",
                "November": "11",
                "December": "12"
            }
            let val = months_str[e];
            toggleList = toggleList.filter((task) => task.date.substring(5, 7) === val)    
        } else if (option === 'R') {
            this.setState({
                tasks: this.state.prevTasks
            })
            return;
        }

        this.setState(prevState => {
            return {
                tasks: toggleList,
                prevTasks: prevState.tasks
            }
        })
    }

    render() {
        // console.log(this.state.tasks);
        const {
            tasks,
            subTasks,
            years,
            months,
        } = this.state;
        return(
            <div className='container'>
                <div className="canvas-items">
                    <Report dates={this.state.dates} />
                </div>
                <div className='row mt-5'>
                    <div className=''>   
                        <button type="button" className='btn btn-outline-primary m-2'
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModalToggle"
                            onClick={() => this.addClick()}>
                                Add a Task
                            </button>
                    </div>
                </div>
                <div className='row justify-content-center m-2'>
                    <div className='col-md-2'>
                        <select className="form-select" onChange={(event) => this.toggleOptions(event.target.value, "Y")}>
                            <option value="" disabled selected>Years</option>
                            {years.map((year, index) => 
                                <option key={index} value={year}>{year}</option>
                            )}
                        </select>
                    </div>
                    <div className='col-md-2'>
                        <select className="form-select" onChange={(event) => this.toggleOptions(event.target.value, "M")}>
                            <option value="" disabled selected>Months</option>
                            {months.map((month, index) => 
                                <option key={index} value={month}>{month}</option>
                            )}
                        </select>
                    </div>
                    <div className='col-md-2'>
                        <button type="button" 
                            className="btn btn-outline-success"
                            onClick={() => this.toggleOptions(null, "R")}>
                            Refresh
                            </button>
                    </div>
                </div>
                <div className='row justify-content-center px-5 mt-3'>
                    <div className="col-lg-7 list">
                            <div className="accordion accordion" id="accordionExample">
                                {tasks.map((task, index) => 
                                    <div className="text-start shadow border mt-3 p-1 pt-2 pb-2" 
                                        key={index} 
                                        draggable
                                        onDragStart={(e) => this.dragItem.current = index}
                                        onDragEnter={(e) => this.dragOverItem.current = index}
                                        onDragEnd={this.handleSort}
                                        onDragOver={(e) => e.preventDefault()}> {/*key={task._id}>*/}
                                        <i className="bi bi-grip-vertical drag-option"></i>
                                        <input 
                                            className='form-check-input mt-3' 
                                            type="checkbox" 
                                            value=""
                                            onChange={() => this.changeCompleted(task, "")}
                                            checked={task.completed} />
                                        <button type="button"
                                            className="btn border-0 m-0 btn-focus title-button text-start" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target={"#a" + task._id + "d"} 
                                            aria-expanded="false" 
                                            aria-controls={"a" + task._id + "d"}>
                                            <span className={task.completed === true ? "text-decoration-line-through" : ""}>{task.title}</span>
                                        </button>
                                        <span className='text-muted ms-2'>{task.date.substring(0, 10)}</span>
                                        <div id={"a" + task._id + "d"} className="collapse" aria-labelledby={"heading" + task._id} data-bs-parent={"#a" + task._id + "d"}>
                                            <div className="card card-body p-0">
                                                <div className='text-muted m-2 p-2'>{task.note}</div>
                                                <ul className='list-group'>
                                                    {task.subTasks.map(subtask => 
                                                        <li key={subtask._id} 
                                                            className="list-group-item border-0">
                                                            <div className='form-check'>
                                                                <input 
                                                                    className='form-check-input mt-2' 
                                                                    type="checkbox" 
                                                                    value=""
                                                                    onChange={() => this.changeCompleted(task, subtask)}
                                                                    checked={subtask.sub_completed} />
                                                                <a href={subtask.link} 
                                                                    rel="noreferrer" 
                                                                    target="_blank"
                                                                    style={{textDecoration: "None", color: "#000"}}
                                                                    >
                                                                    <img className= "m-1" src={subtask.icon_url} height="25" width="25" alt="..." />
                                                                    <span className={subtask.sub_completed === true ? "text-decoration-line-through" : ""}>{subtask.sub_title}</span>
                                                                    </a>
                                                            </div>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                        <button type="button" 
                                            className='btn btn-outline-info m-2'
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModalToggle"
                                            onClick={() => this.editClick(task)}>
                                                Edit
                                        </button>
                                        <button type="button" 
                                            className='btn btn-outline-danger m-2'
                                            onClick={() => this.deleteClick(task._id)}>
                                                Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                    </div>
                </div>
                <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalToggleLabel">Task</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className='form-floating mb-3'>
                                    <input type="text" 
                                        className="form-control" 
                                        id="floatingInput1"
                                        value={this.state.title}
                                        onChange={this.changeTitle} />
                                    <label htmlFor="floatingInput1">Title</label>
                                </div>
                                <div className='form-floating mb-3'>
                                    <input type="date" 
                                        className="form-control" 
                                        id="floatingInput2"
                                        value={this.state.date}
                                        onChange={this.changeDate} />
                                    <label htmlFor="floatingInput2">Date</label>
                                </div>
                                <div className='form-floating'>
                                    <textarea className="form-control" 
                                        id="floatingInput3"
                                        value={this.state.note}
                                        onChange={this.changeNote}></textarea>
                                    <label htmlFor="floatingInput3">Note</label>
                                </div>
                                <ul className='list-group'>
                                    <div className='text-muted text-start m-1'>Sub Tasks: </div>
                                    {subTasks.map((task, index) => 
                                        <li key={index} className="list-group-item text-start border">
                                            <img className= "m-1" src={task.icon_url} height="25" width="25" alt="..." />
                                            {task.sub_title}
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div className="modal-footer">
                                {this.state.taskId === 0 ?
                                    <button type="button" 
                                        className="btn btn-outline-primary" 
                                        data-bs-dismiss="modal" 
                                        aria-label="Close"
                                        onClick={() => this.postTasks()}>Save
                                        </button>
                                    :
                                    <button type="button" 
                                        className="btn btn-outline-primary" 
                                        data-bs-dismiss="modal" 
                                        aria-label="Close"
                                        onClick={() => this.updateTasks(this.state.taskId)}>Update
                                        </button>
                                }
                                
                                <button className="btn btn-outline-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal" data-bs-dismiss="modal">Add Sub Tasks</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalToggleLabel2">Sub Tasks</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className='form-floating mb-3'>
                                    <input type="text" 
                                        className="form-control" 
                                        id="floatingInput1"
                                        value={this.state.sub_title}
                                        onChange={this.changeSubTitle}
                                        />
                                    <label htmlFor="floatingInput1">Sub Title</label>
                                </div>
                                <div className='form-floating mb-3'>
                                    <input type="text" 
                                        className="form-control" 
                                        id="floatingInput2"
                                        value={this.state.icon_url}
                                        onChange={this.changeIconUrl}
                                        />
                                    <label htmlFor="floatingInput2">Icon URL</label>
                                </div>
                                <div className='form-floating mb-3'>
                                    <input type="text" 
                                        className="form-control" 
                                        id="floatingInput3" 
                                        value={this.state.link}
                                        onChange={this.changeLink}
                                        />
                                    <label htmlFor="floatingInput3">Link</label>
                                </div>
                                <div className=''>
                                    <button className="btn btn-outline-info"
                                        data-bs-target="#exampleModalToggle"
                                        data-bs-toggle="modal"
                                        data-bs-dismiss="modal"
                                        onClick={() => this.addSubTasks()}>Add
                                    </button>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-outline-primary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" data-bs-dismiss="modal">Go Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) 
    }
}