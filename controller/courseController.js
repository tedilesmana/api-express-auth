const Course = require('../models/course');
var fs = require("fs-extra");
const path = require('path');

exports.listCourse = async (req, res) => {
    let data = await Course.find()
    res.send(JSON.stringify({ "status": 200, "error": null, "response": data }))
}

exports.detailCourse = async (req, res) => {
    const data = await Course.findById(req.params.id)
    res.send(JSON.stringify({ "status": 200, "error": null, "response": data }))
}

exports.tambahCourse = async (req, res) => {
    console.log(req.files);
    console.log(req.body);
    if (req.files) {
        let img = req.files.file;
        let path = "./public/image/" + img.name;

        img.mv(path, (err) => {
            if (err) {
                console.log(err);
            }
        })
    }
    const courses = new Course(req.body)
    const status = await courses.save()
    res.send(JSON.stringify({ "status": 200, "error": null, "response": status }))
}

exports.ubahCourse = async (req, res) => {
    const { id } = req.params;

    Course.findById(req.params.id, function(err, course) {
        if (err) {
            return console.log(err);
        }

        var old_image = course.image;
        console.log(old_image);
        console.log(req.files);
        console.log(req.body);
        console.log(req.body.file);

        if (req.files) {
            let img = req.files.file;
            let path = "./public/image/" + img.name;
            let old_path = "./public/image/" + old_image;
            console.log(path);
            console.log(old_path);

            if (path != old_path) {
                fs.remove(old_path);
            }

            img.mv(path, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    });

    const status = await Course.update({ _id: id }, req.body)
    res.send(JSON.stringify({ "status": 200, "error": null, "response": status }))
}

exports.hapusCourse = async (req, res) => {
    let { id } = req.params
    var image = req.query.action;
    var path = "public/image/" + image;
    fs.remove(path);
    const status = await Course.remove({ _id: id })
    res.send(JSON.stringify({ "status": 200, "error": null, "response": status }))
}