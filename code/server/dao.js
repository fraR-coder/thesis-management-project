
const db = require('./db');


// PROFESSOR SECTION
exports.getProfessors = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, name, surname, department_code FROM teachers'
    db.all(
      sql,
      [],
      (err,rows) => {
        if(err) {
          reject(err);
        } else if(rows.length == 0) {
          resolve({error: 'Problems while retrieving possible internal cosupervisors'});
        } else {
          const internals = rows.map(row => ({
            id: row.id,
            name: row.name,
            surname: row.surname,
            department_code: row.department_code
          }));
          resolve(internals);
        }
      }
    );
  });
}

exports.getExternals = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT name, surname, company FROM external_cosupervisors'
    db.all(
      sql,
      [],
      (err,rows) => {
        if(err) {
          reject(err);
        } else if(rows.length == 0) {
          resolve({error: 'Problems while retrieving possible external cosupervisors'});
        } else {
          const externals = rows.map(row => ({
            name: row.name,
            surname: row.surname,
            company: row.company
          }));
          resolve(externals);
        }
      }
    );
  });
}

exports.getDegrees = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT degree_code, degree_title FROM degrees';
    db.all(
      sql,
      [],
      (err,rows) => {
        if(err) {
          reject(err);
        } else if(rows.length == 0) {
          resolve({error: 'Problems while retrieving degrees info'});
        } else {
          const degrees = rows.map((row) => (`${row.degree_code}  ${row.degree_title}`));
          resolve(degrees);
        }
      }
    );
  });
}

exports.getGroupForTeacherById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT group_code FROM teachers WHERE id=?'
    db.get(
      sql,
      [id],
      (err, row) => {
        if(err){
          reject(err);
        } else if (row == null) {
          resolve({error: `Prolem while retrieving group info for teacher ${id}`});
        } else {
          resolve(row.group_code);
        }
      }
    )
  });
}

exports.saveNewProposal = (proposal) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO thesis_proposals (title, supervisor, cosupervisors, keywords, " +
              "type, groups, description, requirements, notes, expiration, level, cds) " +
              "values (?,?,?,?,?,?,?,?,?,?,?,?)"
  db.run(
    sql, 
    [proposal.title, proposal.supervisor, proposal.cosupervisors, proposal.keywords, proposal.type, proposal.groups, proposal.description, proposal.requirements, proposal.notes, proposal.expiration, proposal.level, proposal.cds],
    function(err) {
      if(err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    }
  );
  });
}

