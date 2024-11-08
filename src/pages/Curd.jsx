import React, { useEffect, useState } from 'react'
import './curd.css'
import { Alert, Button, Card, CardHeader, Col, Container, Form, Row, Table, Toast } from 'react-bootstrap'
import { RiTodoLine } from "react-icons/ri";//todo icon
import { CiSquareCheck } from "react-icons/ci";//check icon
import { MdOutlineModeEditOutline } from "react-icons/md";//Edit icon
import { MdDelete } from "react-icons/md";//delete icon
import { FaRegSquare } from 'react-icons/fa';

export default function Curd() {
    const [selectedTasksMsg, setSelectedTasksMsg] = useState(false);
    const [selectedTask, setSelectedTask] = useState(0)
    const toggleShowSelectedTask = () => {
        if (!selectedTasksMsg) {
            if (selectedTask > 0) {
                setTimeout(() => {
                    setSelectedTasksMsg(false)
                }, 2000);
                setSelectedTasksMsg(!selectedTasksMsg)
            }
        } else {
            setSelectedTasksMsg(!selectedTasksMsg)
        }
    };

    const [deletedTasksMsg, setDeletedTasksMsg] = useState(false);
    const toggleShowDeletedTask = () => {
        if (!deletedTasksMsg) {
            if (todos.length > 0) {
                setTimeout(() => {
                    setDeletedTasksMsg(false)
                }, 2000);
                setDeletedTasksMsg(!deletedTasksMsg)
            }
        } else {
            setDeletedTasksMsg(!deletedTasksMsg)
        }
    };

    const [editId, setEditId] = useState()
    const [editIndex, setEditIndex] = useState()
    const [todos, setTodos] = useState([])
    const [userInput, setUserInput] = useState("")
    const [currentActiveBtn, setCurrentActiveBtn] = useState('all')
    const [todoStatus, setTodoStatus] = useState('Pending')
    useEffect(() => {
        fetch("http://localhost:3000/todos")
            .then(res => res.json())
            .then((res) => setTodos(res))
            .catch(err => console.log("fetching erroe", err))
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault()
        if (userInput) {
            if (editId) {
                fetch(`http://localhost:3000/todos/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: editId,
                        todo: userInput,
                        status: todoStatus,
                        selected: todos[editIndex].selected
                    })
                })
                    .then(res => res.json())
                    .then(updatedTodo => {
                        const newTodos = [...todos]
                        newTodos[editIndex] = updatedTodo
                        setTodos(newTodos)
                        setEditId(null);
                        setUserInput("");
                        setTodoStatus('')
                    })
                    .catch(err => console.log("update error", err));
            } else {
                setTodos([...todos, { todo: userInput, status: 'pending', selected: false }])
                fetch('http://localhost:3000/todos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        todo: userInput,
                        status: todoStatus
                    })
                })
                    .then(res => res.json())
                    .then((res) => {
                        setTodos([...todos, res])
                        setUserInput("")
                    }).catch((err) => console.log("post errs", err))
            }
        }
    }
    // All button functionality
    const handleAll = (e) => {
        setCurrentActiveBtn('all')
        fetch("http://localhost:3000/todos")
            .then(res => res.json())
            .then((res) => {
                setTodos(res)
            })
            .catch(err => console.log("handle All error", err))
    }

    // Done button functionality
    const handleDone = () => {
        setCurrentActiveBtn('done')
        fetch("http://localhost:3000/todos")
            .then(res => res.json())
            .then((res) => {
                let doneTodo = res
                doneTodo = res.filter((todo) => todo.status === 'Done')
                setTodos(doneTodo)
            })
    }
    // Pending button functionality

    const handlePending = () => {
        setCurrentActiveBtn('pending')
        fetch("http://localhost:3000/todos")
            .then(res => res.json())
            .then((res) => {
                let pendingTodos = res
                pendingTodos = res?.filter((todo) => todo.status === 'Pending')
                setTodos(pendingTodos)
            })
    }
    // in-progress button functionality
    const handleInProgress = () => {
        setCurrentActiveBtn('in-progress')
        fetch("http://localhost:3000/todos")
            .then(res => res.json())
            .then((res) => {
                let inprogressTodos = res
                inprogressTodos = res?.filter((todo) => todo.status === 'In-Progress')
                setTodos(inprogressTodos)
            })
    }

    // Delete button functionality
    const handleDelete = (id) => {
        if (!window.confirm("are you sure delete this task ?")) {
            return
        }
        fetch(`http://localhost:3000/todos/${id}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(() => {
                const deletes = todos.filter((todo) => todo.id !== id)
                setTodos(deletes)
            })
            .catch((err) => console.log("delete error", err))

    }
    const handleEdit = (id, item, index) => {
        setEditId(id)
        setUserInput(item.todo)
        setTodoStatus(item.status)
        setEditIndex(index)
    }

    const handleStatus = (index, id) => {
        setSelectedTask(selectedTask + 1)
        if (!todos[index].selected) {
            fetch(`http://localhost:3000/todos/${id}`, {
                method: 'PUT', /* or PATCH */
                body: JSON.stringify({
                    id: todos[index].id,
                    todo: todos[index].todo,
                    status: todos[index].status
                })
            })
                .then(res => res.json()).then(console.log())
            const newTodos = [...todos]
            newTodos[index].selected = true
            setTodos(newTodos)
        } else {
            fetch(`http://localhost:3000/todos/${id}`, {
                method: 'PUT', /* or PATCH */
                body: JSON.stringify({
                    id: todos[index].id,
                    todo: todos[index].todo,
                    status: todos[index].status
                })
            })
                .then(res => res.json()).then(console.log())
            const newTodos = [...todos]
            newTodos[index].selected = false
            setTodos(newTodos)
        }
    }

    // DeleteDoneTask button functionality
    const handleDoneTask = () => {
        if (selectedTask > 0) {
            setSelectedTask(0)
            let doneTodo = todos.filter((todo) => todo.selected)
            const notDoneTodo = todos.filter((todo) => !todo.selected)
            setTodos(notDoneTodo)
            doneTodo.map((todo) => {
                fetch(`http://localhost:3000/todos/${todo.id}`, {
                    method: 'DELETE'
                })
                    .then(res => res.json())
                    .catch(err => console.log("Error deleting all tasks", err));
                return false
            })

        }

    }

    //DeleteAllTask button functionality
    const handleDeleteAllTask = () => {
        if (todos.length > 0) {
            let deleteTodo = todos
            deleteTodo.map((todo) => {
                fetch(`http://localhost:3000/todos/${todo.id}`, {
                    method: 'DELETE'
                }).then(() => {
                    setTodos([]);
                })
                return false
            })
        }

    }
    return (
        <>
            <Container>
                <Row>
                    <Card className='main-card'>
                        <CardHeader className='main-card' >
                            <h3 className='text-center'>TodoInput</h3>
                            <div id='form-main'>
                                <Form onSubmit={handleSubmit} >
                                    <Row >
                                        <div className="input-main">
                                            <Col lg="8" sm="6" >
                                                <Form.Group className="mb-3"
                                                    controlId="exampleForm.ControlInput1">
                                                    <div id='todo-icon-main'>
                                                        <RiTodoLine id='todo-icon' />
                                                    </div>
                                                    <Form.Control value={userInput}
                                                        className='px-5' type="text"
                                                        placeholder="New Todo"
                                                        onChange={(e) => setUserInput(e.target.value)} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4" sm="6" className='px-2' >
                                                <Form.Select className='mt-4 ' aria-label="Default select example" value={todoStatus} onChange={(e) => { setTodoStatus(e.target.value); }}>
                                                    <option value={"Pending"}>Pending</option>
                                                    <option value={"In-Progress"}>In-Progress</option>
                                                    <option value={'Done'}>Done</option>
                                                </Form.Select>
                                            </Col>
                                        </div>
                                        <Col lg="12" >
                                            <Button variant="primary" id='add-btn' type='submit'>
                                                {editId ? "Edit" : "Add new task"}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </CardHeader>
                    </Card>
                </Row>
                <br />
                <Row >
                    <h3 className='text-center'>TodoList</h3>
                    <Col lg="3" sm="6" className='all-done-todo-main-btn'>
                        <Button className={currentActiveBtn === 'all' ? ` btn btn-danger w-100` : 'all-done-todo-btn'}
                            onClick={handleAll}>All</Button>
                    </Col>
                    <Col lg="3" sm="6" className='all-done-todo-main-btn'>
                        <Button className={currentActiveBtn === 'pending' ? ` btn btn-danger w-100` : 'all-done-todo-btn'}
                            onClick={handlePending} >Pending</Button>

                    </Col>
                    <Col lg="3" sm="6" className='all-done-todo-main-btn '>
                        <Button className={currentActiveBtn === 'in-progress' ? ` btn btn-danger w-100` : 'all-done-todo-btn'}
                            onClick={handleInProgress}>In Progress</Button>
                    </Col>
                    <Col lg="3" sm="6" className={`all-done-todo-main-btn`} >
                        <Button className={currentActiveBtn === 'done' ? ` btn btn-danger w-100` : 'all-done-todo-btn'}
                            onClick={handleDone} >Done</Button>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col style={{ padding: 0 }}>
                        <Table>
                            <tbody>
                                {
                                    todos.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className={item.selected || item.status === "Done" ? " text-danger text-decoration-line-through" : 'text-dark text-decoration-none'} style={{ width: "83%", fontSize: "20px" }}>{item.todo}</td>
                                                <td >
                                                    {item.selected ? < CiSquareCheck id='check-icon' role='button' onClick={(e) => { handleStatus(index, item.id) }} /> : <FaRegSquare id='check-icon'
                                                        role='button' onClick={(e) => { handleStatus(index, item.id) }} />}
                                                </td>
                                                <td>
                                                    <MdOutlineModeEditOutline
                                                        onClick={() => handleEdit(item.id, item, index)}
                                                        id='edit-icon' role='button' />
                                                </td>
                                                <td>
                                                    <MdDelete id='delte-icon'
                                                        onClick={() => handleDelete(item.id)}
                                                        role='button' />
                                                </td>
                                            </tr>)
                                    })
                                }
                            </tbody>


                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col >
                        <Button className='delete-done-tasks-btn'
                            onClick={function (event) { handleDoneTask(); toggleShowSelectedTask() }}
                        >
                            Delete selected task's
                        </Button>
                    </Col>

                    <Col >
                        <Button className='delete-all-tasks-btn'
                            onClick={function (event) { handleDeleteAllTask(); toggleShowDeletedTask() }}
                        >
                            Delete all task
                        </Button>
                    </Col>
                </Row>

                <Row>
                    <Col md={6} className="mb-2">
                        <Toast show={selectedTasksMsg} onClose={toggleShowSelectedTask}>
                            <Toast.Header>
                                <img
                                    src="holder.js/20x20?text=%20"
                                    className="rounded me-2"
                                    alt=""
                                />
                                <strong className="me-auto">selected task's</strong>
                            </Toast.Header>
                            <Alert style={{ padding: 0 }} variant="danger">
                                <Toast.Body>You deleted all selected task's</Toast.Body>
                            </Alert>
                        </Toast>
                    </Col>

                    <Col md={6} className="mb-2">
                        <Toast show={deletedTasksMsg} onClose={toggleShowDeletedTask}>
                            <Toast.Header>
                                <img
                                    src="holder.js/20x20?text=%20"
                                    className="rounded me-2"
                                    alt=""
                                />
                                <strong className="me-auto">Deleted task's</strong>
                            </Toast.Header>
                            <Alert style={{ padding: 0 }} variant="danger">
                                <Toast.Body>You deleted all delete task's</Toast.Body>
                            </Alert>
                        </Toast>
                    </Col>
                </Row>
            </Container >
        </>

    )
}


