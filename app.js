const express = require('express');
const mysql = require('mysql2');
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rp810810810!',
    database: 'c237_studentlistapp'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    const sql = 'SELECT * FROM students';

    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error retrieving students');
        }
        res.render('index', { students: results });
    });
});

app.get('/student', (req, res) => {
    res.render('addStudent');
});

app.post('/student', (req, res) => {
    const { name, dob, contact, image } = req.body;

    const sql = 'INSERT INTO students (name, dob, contact, image) VALUES (?, ?, ?, ?)';

    connection.query(sql, [name, dob, contact, image], (error, results) => {
        if (error) {
            console.error('Error adding student:', error);
            return res.send('Error adding student');
        }
        res.redirect('/');
    });
});

app.get('/editStudent/:id', (req, res) => {
    const studentId = req.params.id;
    const sql = 'SELECT * FROM students WHERE studentid = ?';

    connection.query(sql, [studentId], (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.send('Error retrieving student');
        }

        if (results.length > 0) {
            res.render('editStudent', { student: results[0] });
        } else {
            res.send('Student not found');
        }
    });
});

app.post('/editStudent/:id', (req, res) => {
    const studentId = req.params.id;
    const { name, dob, contact, image } = req.body;
    const sql = 'UPDATE students SET name = ?, dob = ?, contact = ?, image = ? WHERE studentid = ?';

    connection.query(sql, [name, dob, contact, image, studentId], (error, results) => {
        if (error) {
            console.error('Error updating student:', error);
            return res.send('Error updating student');
        }
        res.redirect('/');
    });
});

app.post('/deleteStudent/:id', (req, res) => {
    const studentId = req.params.id;
    const sql = 'DELETE FROM students WHERE studentid = ?';

    connection.query(sql, [studentId], (error, results) => {
        if (error) {
            console.error('Error deleting student:', error);
            return res.send('Error deleting student');
        }
        res.redirect('/');
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});