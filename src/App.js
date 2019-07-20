import React from 'react';
// import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import ListItem from './ListItem';
import loadingGif from './loading.gif';

class App extends React.Component{
    constructor(){

        // parent constructor
        super();

        // set state
        this.state = {
            notification: '',   // the success message after crud operation
            newTodo: '',        // the todo to be added (string contained in the input field)
            editing: false,     // boolean to indicate if currently editing a todo or not
            editingIndex: null, // if editing is true, contains the currently edited todo index, null otherwise
            todos: [],          // local list of todos
            loading: true      // loading state
        };

        // mock rest api url
        this.apiUrl = 'https://5d2612aaeeb36400145c5886.mockapi.io';

        // bindings
        this.alert = this.alert.bind(this);
        this.editTodo = this.editTodo.bind(this);
        this.updateTodo = this.updateTodo.bind(this);
        this.deleteTodo = this.deleteTodo.bind(this);
        this.addTodo = this.addTodo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateData = this.validateData.bind(this);
    }

    async componentDidMount(){
        //once component is mounted in the tree, get all todos
        const response = await axios.get(`${this.apiUrl}/todos`)
        
        // load todos in the local todos list
        this.setState({
            todos: response.data,
            loading: false
        });
    }

    alert(notification){
        // this displays the notification
        this.setState({
            notification 
        });

        // this clears the notification after 2 seconds
        setTimeout(() => {this.setState({notification: null});}, 2000);
    }

    validateData(){
        // used to validated the content of the input field
        return this.state.newTodo < 5;
    }

    handleChange(event){
        // newTodo is updated everytime the input field changes
        this.setState({newTodo: event.target.value});
    }

    editTodo(index){
        // retrieve todo to edit
        const todo = this.state.todos[index];

        // update tmp values
        this.setState({
            editing: true,
            editingIndex: index,
            newTodo: todo.name
        });

        // display sucess alert
        this.alert('Todo edited successfully');
    }

    async updateTodo(){
        // retrieve todo to update and edit its name
        const todo = this.state.todos[this.state.editingIndex]

        // update the todo in the database
        const response = await axios.put(`${this.apiUrl}/todos/${todo.id}`, {name: this.state.newTodo});

        // update todos locally
        const todos = this.state.todos;
        todos[this.state.editingIndex] = response.data;
        this.setState({todos, editing: false, editingIndex: null, newTodo: ''});

        // display sucess alert
        this.alert('Todo updated successfully');
    }

    async deleteTodo(index){
        // retrieve local todos and select the todo to be deleted
        const todos = this.state.todos;
        const todo = todos[index];

        // delete the todo in the database
        await axios.delete(`${this.apiUrl}/todos/${todo.id}`);

        // delete the todo locally and update state
        delete todos[index];
        this.setState({ todos });

        // display success alert
        this.alert('Todo deleted successfully');
    }

    async addTodo(){
        // add todo in the database
        const response = await axios.post(`${this.apiUrl}/todos`, {
        name: this.state.newTodo
        });

        // add todo locally and update state
        const oldTodos = this.state.todos;
        oldTodos.push(response.data);
        this.setState({todos: oldTodos, newTodo: ''});

        // display success alert
        this.alert('Todo added successfully');
    }

    render(){
        return(
        <div className="App">
            <header className="App-header">
                <h1 className="App-title">CRUD React</h1>
            </header>
            <div className="container">

                {/* success notification */}
                {
                this.state.notification &&
                <div className="alert alert-success">
                    <p className="text-center">{this.state.notification}</p>
                </div>
                }

                {/* input field */}
                <input type="text" className="form-control my-4" placeholder="Add a new todo" onChange={this.handleChange} value={this.state.newTodo}/>

                {/* update button */}
                <button 
                    className="btn-info mb-3 form-control"
                    onClick={this.state.editing ? this.updateTodo : this.addTodo}
                    disabled={this.validateData()}>
                        {this.state.editing ? 'Update Todo' : 'Add Todo'}
                </button>

                {/* loading gif */}
                {
                    this.state.loading &&
                    <img src={loadingGif} alt="" />
                }

                {/* todos title */}
                <h2 className="text-center p-4">Todos App</h2>

                {/* todos list */}
                {
                    (!this.state.editing || this.state.loading) && 
                    <ul className="list-group">
                        {this.state.todos.map( (item, index) => {
                            return <ListItem key={item.id}
                                item={item} 
                                editTodo={() => {this.editTodo(index);}} 
                                deleteTodo={() => { this.deleteTodo(index); }
                            }/>
                        })}
                    </ul>
                }

            </div>
        </div>
        ); // return
    } // render()
}

export default App;
