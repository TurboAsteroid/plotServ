let mongoose = require("mongoose");
let TaskT = require('../app/models/taskM');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Tasks', () => {
    beforeEach((done) => {
        TaskT.remove({}, (err) => {
            done();
        });
    });

    describe('/GET task', () => {
        it('GET all the tasks', (done) => {
            chai.request(server)
                .get('/task')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST task', () => {
        it('Post without require field', (done) => {
            let task = {
                operatorName: "Vasily",
                subName: "Egor",
                taskDuration: 3
            };
            chai.request(server)
                .post('/task')
                .send(task)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('taskReason');
                    done();
                });
        });
        it('POST a task ', (done) => {
            let task = {
                operatorName: "Vasily",
                subName: "Egor",
                taskDuration: 3,
                taskReason: "no link"
            };
            chai.request(server)
                .post('/task')
                .send(task)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('TaskT successfully added!');
                    res.body.task.should.have.property('operatorName');
                    res.body.task.should.have.property('subName');
                    res.body.task.should.have.property('taskReason');
                    res.body.task.should.have.property('taskDuration');
                    done();
                });
        });
    });

    describe('/GET/:id task', () => {
        it('GET a task', (done) => {
            let task = new TaskT({
                operatorName: "Vasily",
                subName: "Egor",
                taskDuration: 3,
                taskReason: "no link"
            });
            task.save((err, task) => {
                chai.request(server)
                    .get('/task/' + task.id)
                    .send(task)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('operatorName');
                        res.body.should.have.property('subName');
                        res.body.should.have.property('taskReason');
                        res.body.should.have.property('taskDuration');
                        res.body.should.have.property('_id').eql(task.id);
                        done();
                    });
            });

        });
    });

    describe('/PUT/:id task', () => {
        it('UPDATE a task', (done) => {
            let task = new TaskT({
				operatorName: "Anton",
				subName: "Stas",
				taskDuration: 2,
				taskReason: "forget pass"
            });
            task.save((err, task) => {
                chai.request(server)
                    .put('/task/' + task.id)
                    .send({
						operatorName: "Anton",
						subName: "Stas",
						taskDuration: 5,
						taskReason: "forget pass"
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('TaskT updated!');
                        res.body.task.should.have.property('taskDuration').eql(5);
                        done();
                    });
            });
        });
    });

    describe('/DELETE/:id task', () => {
        it('DELETE a task', (done) => {
            let task = new TaskT({
				operatorName: "Anton",
				subName: "Stas",
				taskDuration: 5,
				taskReason: "forget pass"
            });
            task.save((err, task) => {
                chai.request(server)
                    .delete('/task/' + task.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('TaskT successfully deleted!');
                        res.body.result.should.have.property('ok').eql(1);
                        res.body.result.should.have.property('n').eql(1);
                        done();
                    });
            });
        });
    });
});
  