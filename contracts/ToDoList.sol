// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract ToDoList is Ownable {
    struct Task {
        string content;
        bool isDone;
    }

    event TaskAdded(string _content);

    modifier indexIsInRange(uint _index) {
        require(_index < _tasks.length, "Task index is out of range");
        _;
    }

    Task[] private _tasks;

    function addTask(string calldata _content) external {
        uint undoneTaskCount = 0;

        for(uint i = 0; i < _tasks.length; i++) {
            if(_tasks[i].isDone) {
                undoneTaskCount++;
            }
        }

        require(undoneTaskCount < 10, "First finish the current 10 tasks");

        _tasks.push(Task(_content, false));

        emit TaskAdded(_content);
    }

    function finishTask(uint _index) external indexIsInRange(_index) {
        _tasks[_index].isDone = true;
    }
    
    function deleteTask(uint _index) external onlyOwner indexIsInRange(_index) returns(uint) { // only the owner can delete tasks
        _tasks[_index] = _tasks[_tasks.length - 1];

        _tasks.pop();
    }

    function getTaskCount() external view returns(uint) {
        return _tasks.length;
    }

    function getTask(uint _index) external view indexIsInRange(_index) returns(string memory, bool) {
        Task memory task = _tasks[_index];

        return (task.content, task.isDone);
    }
}