const db = require('./db');
const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
var isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
const { Applications, Application, Student, ThesisProposal, Teacher } = require('./model');

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

// STUDENT SECTION
exports.addApplicationForThesis = (thesisId, studentId, timestamp, status, teacherId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO applications (thesisid, studentid, timestamp, status,teacherid) VALUES (?,?,?,?,?)';
    db.run(
      sql,
      [thesisId, studentId, timestamp, status, teacherId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      }
    );
  });
}

exports.getThesisProposals = (degCode) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * from thesis_proposals'
    db.all(
      sql,
      [],
      (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length === 0) {
          resolve({ error: `No thesis proposals found for study course ${degCode}` });
        } else {
          const proposals = rows
            .filter(r => r.cds.match(degCode) !== null)
            .map((row) => ({
              id: row.id,
              title: row.title,
              supervisor: row.supervisor,
              cosupervisors: row.cosupervisors.split('-'),
              keywords: row.keywords.split(','),
              type: row.type,
              groups: row.groups.split(','),
              description: row.description,
              requirements: row.requirements,
              notes: row.notes,
              expiration: row.expiration,
              level: row.level,
              cds: row.cds.split(','),
            }
            ));

          if (proposals.length == 0) {
            resolve({ error: `No thesis proposals found for study course ${degCode}` });
          } else {
            resolve(proposals);
          }
        }
      }
    )
  });
}

exports.getStudentById = (studentId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * from students where id=? ';
    db.all(
      sql,
      [studentId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length === 0) {
          resolve(
            { error: `No student found for id ${studentId}` }
          );
        } else {
          const student = new Student(
            rows[0].id,
            rows[0].surname,
            rows[0].name,
            rows[0].gender,
            rows[0].nationality,
            rows[0].email,
            rows[0].degree_code,
            rows[0].enrollment_year
          );
          resolve(student);
        }
      });
  });
};

exports.getApplicationsForStudent = (studentId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM applications WHERE studentid=?';
    db.all(
      sql,
      [studentId],
      (err,rows) => {
        if (err) {
          reject(err);
        } else {
          if (rows.length == 0 || rows == null || rows == undefined) {
            resolve({ status:404, error: `No applications found for student ${studentId}` });
          } else {
            const applications = rows.map(row => (
              new Application(row.thesisid, row.studentid, row.timestamp, row.status, row.teacherid)
            ));
            //console.log(applications);
            resolve(applications);
          }
        }
    });
  });
}
// PROFESSOR SECTION
exports.getOwnProposals = (teacherId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM thesis_proposals'
    db.all(
      sql,
      [],
      (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length === 0) {
          resolve({ error: `No thesis proposals found for teacher ${teacherId}` });
        } else {
          const proposals = rows
            .filter(r => r.supervisor.match(teacherId) !== null)
            .map((row) => ({
              id: row.id,
              title: row.title,
              supervisor: row.supervisor,
              cosupervisors: row.cosupervisors.split('-'),
              keywords: row.keywords.split(','),
              type: row.type,
              groups: row.groups.split(','),
              description: row.description,
              requirements: row.requirements,
              notes: row.notes,
              expiration: row.expiration,
              level: row.level,
              cds: row.cds.split(','),
            }
            ));

          if (proposals.length == 0) {
            resolve({ error: `No thesis proposals found for teacher ${teacherId}` });
          } else {
            resolve(proposals);
          }
        }
      }
    )
  });
}

exports.getProfessors = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id, name, surname, department_code FROM teachers'
    db.all(
      sql,
      [],
      (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length == 0) {
          resolve({ error: 'Problems while retrieving possible internal cosupervisors' });
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
      (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length == 0) {
          resolve({ error: 'Problems while retrieving possible external cosupervisors' });
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
      (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length == 0) {
          resolve({ error: 'Problems while retrieving degrees info' });
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
        if (err) {
          reject(err);
        } else if (row == null) {
          resolve({ error: `Prolem while retrieving group info for teacher ${id}` });
        } else {
          resolve(row.group_code);
        }
      }
    )
  });
}

//can be used also when virtual clock changes
exports.saveNewProposal = (proposal) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO thesis_proposals (title, supervisor, cosupervisors, keywords, " +
      "type, groups, description, requirements, notes, expiration, level, cds) " +
      "values (?,?,?,?,?,?,?,?,?,?,?,?)"
    db.run(
      sql,
      [proposal.title, proposal.supervisor, proposal.cosupervisors, proposal.keywords, proposal.type, proposal.groups, proposal.description, proposal.requirements, proposal.notes, proposal.expiration, proposal.level, proposal.cds],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

exports.deleteProposal = (proposalId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM thesis_proposals WHERE id=?'
    db.run(
      sql,
      [proposalId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      }
    )
  });
}

exports.acceptApplication = (thesisId, teacherId, studentId) => {
  console.log(thesisId, teacherId, studentId);
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE applications SET status = "accepted" WHERE thesisid = ?  AND teacherId = ? AND studentid=? and status="pending"';

    db.run(
      sql,
      [thesisId, teacherId, studentId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          // return application updated
          const updatedApplication = {
            id: thesisId,
            status: 'accepted',
          };
          resolve(updatedApplication);
        }
      }
    );
  });
};


exports.rejectApplication = (thesisId, teacherId, studentId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE applications SET status = "rejected" WHERE thesisid = ?  AND teacherId = ? AND studentid=? and status="pending"';

    db.run(
      sql,
      [thesisId, teacherId, studentId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          const updatedApplication = {
            id: thesisId,
            status: 'rejected',
          };
          resolve(updatedApplication);
        }
      }
    );
  });
};

exports.cancellPendingApplicationsForAThesis = (thesisId, teacherId) => {
  //console.log(`Got thesis ${thesisId} and teacher ${teacherId}`)
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE applications SET status = "canceled" WHERE thesisid = ?  AND teacherId = ? and status="pending" ';
    db.run(
      sql,
      [thesisId, teacherId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          /* const updatedApplication = {
            id: thesisId,
            status: 'canceled',
          }; */
          resolve(this.changes);
        }
      }
    );
  });
};


exports.updateApplicationsForExpiredProposals = (thesisId, teacherId) => {
  //console.log(`Got thesis ${thesisId} and teacher ${teacherId}`)
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE applications SET status = "expired" WHERE thesisid = ?  AND teacherId = ? and status="pending" ';
    db.run(
      sql,
      [thesisId, teacherId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          /* const updatedApplication = {
            id: thesisId,
            status: 'canceled',
          }; */
          resolve(this.changes);
        }
      }
    );
  });
};

exports.reviveExpiredApplications = (thesisId, newProposalId) => {
  return new Promise((resolve,reject) => {
    const sql = 'UPDATE applications SET thesisid=?,status=? WHERE thesisid=? AND status=?'
    db.run(
      sql,
      [newProposalId, "pending", thesisId, "expired"],
      function (err){
          if(err){
            reject(err);
          } else {
            resolve(this.changes);
          }
      }
    )
  })
}


exports.cancellPendingApplicationsOfAStudent= (studentId) => {
  //console.log(`Gotten student ${studentId} and teacher ${teacherId}`)
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE applications SET status = "canceled" WHERE studentid = ? and status="pending"';

    db.run(
      sql,
      [studentId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          /* const updatedApplication = {
            id: studentId,
            status: 'canceled',
          }; */
          resolve(this.changes);
        }
      }
    );
  });
};

exports.getAllApplicationsByProf = (idProfessor) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM applications where teacherid=?'
    db.all(
      sql,
      [idProfessor],
      (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length == 0) {
          resolve({status:404, error: 'No Applications found for professor ' + idProfessor });
        } else {
          const applications = rows.map(row => (
            new Application(row.thesisid, row.studentid, row.timestamp, row.status, row.teacherid)
          ));
          resolve(applications);
        }
      }
    );
  });
}

exports.getThesisProposalById = (thesisId, status='none') => {
  return new Promise((resolve, reject) => {
    let sql = '';
    if(status == 'accepted' || status == 'canceled' || status == 'expired') { //means the thesis is archived, look in the right table
      sql = 'SELECT * from archived_thesis_proposals where id=?';
    } else {
      sql = 'SELECT * from thesis_proposals where id=? ';
    }
    
    db.all(
      sql,
      [thesisId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length === 0) {
          resolve(
            { error: `No thesis proposals found for id ${thesisId}` }
          );
        } else {
          const proposal = new ThesisProposal(
            rows[0].id,
            rows[0].title,
            rows[0].supervisor,
            rows[0].cosupervisors.split('-'),
            rows[0].keywords.split(','),
            rows[0].type,
            rows[0].groups.split(','),
            rows[0].description,
            rows[0].requirements,
            rows[0].notes,
            rows[0].expiration,
            rows[0].level,
            rows[0].cds.split(',')
          );

          resolve(proposal);
        }
      });
  });
};

exports.getTeacherById = (teacherId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * from teachers where id=? ';
    db.all(
      sql,
      [teacherId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else if (rows.length === 0) {
          resolve(
            { error: `No teacher found for id ${teacherId}` }
          );
        } else {
          const teacher = new Teacher(
            rows[0].id,
            rows[0].surname,
            rows[0].name,
            rows[0].email,
            rows[0].group_code,
            rows[0].department_code
          );
          resolve(teacher);
        }
      });
  });
};
//VIRTUAL CLOCK ONLY 
exports.getExpiredProposals = (selectedTimestamp) => {
  const ts = dayjs(selectedTimestamp, "DD-MM-YYYY");
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * from thesis_proposals'
    db.all(
      sql,
      [],
      (err, rows) => {
        if (err) {
          reject(err)
        } else if (rows.length == 0) {
          resolve({ error: `No thesis proposals found while changing time` });
        } else {
          const proposals = rows
            .filter(r => {
              const pts = dayjs(r.expiration, "DD-MM-YYYY");
              if (pts.isBefore(ts))
                return r;
            })
            .map((row) => (
              {
                id: row.id,
                title: row.title,
                supervisor: row.supervisor,
                cosupervisors: row.cosupervisors.split('-'),
                keywords: row.keywords,
                type: row.type,
                groups: row.groups.split('-'),
                description: row.description,
                requirements: row.requirements,
                notes: row.notes,
                expiration: row.expiration,
                level: row.level,
                cds: row.cds.split(','),
              }
            ));
          resolve(proposals);
        }
      }
    )
  });
}

exports.getProposalsToRevive = (selectedTimestamp) => {
  const ts = dayjs(selectedTimestamp, "DD-MM-YYYY");
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * from archived_thesis_proposals'
    db.all(
      sql,
      [],
      (err, rows) => {
        if (err) {
          reject(err)
        } else if (rows.length == 0) {
          resolve({ error: `No archived thesis proposals found while changing time` });
        } else {
          const proposals = rows
            .filter(r => {
              const pts = dayjs(r.expiration, "DD-MM-YYYY");
              if (pts.isSameOrAfter(ts))
                return r;
            })
            .map((row) => (
              {
                id: row.id,
                title: row.title,
                supervisor: row.supervisor,
                cosupervisors: row.cosupervisors.split('-'),
                keywords: row.keywords,
                type: row.type,
                groups: row.groups.split('-'),
                description: row.description,
                requirements: row.requirements,
                notes: row.notes,
                expiration: row.expiration,
                level: row.level,
                cds: row.cds.split(','),
              }
            ));
          resolve(proposals);
        }
      }
    )
  });
}

exports.getAcceptedProposalsIds = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT thesisid FROM applications WHERE status=?';
    db.all(
      sql,
      ["accepted"],
      (err,rows) => {
        if(err) {
          reject(err);
        } else if(!rows || rows.length == 0) {
          console.log("ERROR WITH IDS")
          resolve({error: "No accepted applications, can revive all proposals"});
        } else {
          const ids = rows.map(row => row.thesisid);
          console.log(ids);
          resolve(ids);
        }
      }
    )
  });
}

exports.archiveProposal = (proposal) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO archived_thesis_proposals (id, title, supervisor, cosupervisors, keywords, " +
      "type, groups, description, requirements, notes, expiration, level, cds) " +
      "values (?,?,?,?,?,?,?,?,?,?,?,?,?)"
    db.run(
      sql,
      [proposal.id, proposal.title, proposal.supervisor, proposal.cosupervisors, proposal.keywords, proposal.type, proposal.groups, proposal.description, proposal.requirements, proposal.notes, proposal.expiration, proposal.level, proposal.cds],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

exports.deleteProposalFromArchived = (proposalId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM archived_thesis_proposals WHERE id=?'
    db.run(
      sql,
      [proposalId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      }
    )
  });
}

