const helpers = require("./helpers");
const ToDoList = artifacts.require("ToDoList");

contract("ToDoList", (accounts) => {
    const [alice, bob] = accounts;
    const taskContent = "First task";
    let contractInstance;

    beforeEach(async () => {
        contractInstance = await ToDoList.new();
    });

    it("should be able to add a task", async () => {
        const taskCount = await contractInstance.getTaskCount({ from: alice });

        assert.equal(taskCount, 0);

        const result = await contractInstance.addTask(taskContent, { from: alice });

        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args._content, taskContent); // event fired

        const updatedTaskCount = await contractInstance.getTaskCount({ from: alice });

        assert.equal(updatedTaskCount, 1);

        const { 0: content, 1: isDone } = await contractInstance.getTask(0, { from: alice });

        assert.equal(content, taskContent);
        assert.equal(isDone, false);
    })

    it("should be able to finish a task", async () => {
        await contractInstance.addTask(taskContent, { from: alice });

        const { 1: isDone } = await contractInstance.getTask(0, { from: alice });

        assert.equal(isDone, false);

        const result = await contractInstance.finishTask(0, { from: alice });

        assert.equal(result.receipt.status, true);

        const { 1: updatedIsDone } = await contractInstance.getTask(0, { from: alice });

        assert.equal(updatedIsDone, true);
    })

    it("should be able to delete a task if contract owner", async () => {
        await contractInstance.addTask(taskContent, { from: alice });

        const taskCount = await contractInstance.getTaskCount({ from: alice });

        assert.equal(taskCount, 1);

        const result = await contractInstance.deleteTask(0, { from: alice });

        assert.equal(result.receipt.status, true);

        const updatedTaskCount = await contractInstance.getTaskCount({ from: alice });

        assert.equal(updatedTaskCount, 0);
    })

    it("should not be able to delete a task if not contract owner", async () => {
        await contractInstance.addTask(taskContent, { from: bob });

        const taskCount = await contractInstance.getTaskCount({ from: bob });

        assert.equal(taskCount, 1);

        await helpers.shouldThrow(contractInstance.deleteTask(0, {from: bob}));

        const updatedTaskCount = await contractInstance.getTaskCount({ from: bob });

        assert.equal(updatedTaskCount, 1);
    })
})