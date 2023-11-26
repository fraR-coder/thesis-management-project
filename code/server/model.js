"use strict";

function ThesisProposal(id, title, supervisor, cosupervisors, keywords, type, groups, descritpion, requirements, notes, expiration, level, cds) {
    this.id = id;
    this.title = title;
    this.supervisor = supervisor;
    this.cosupervisors = cosupervisors;
    this.keywords = keywords;
    this.type = type;
    this.groups = groups;
    this.description = descritpion;
    this.requirements = requirements;
    this.notes = notes;
    this.expiration = expiration;
    this.level = level;
    this.cds = cds;   
}

function Application( thesisId,studentId,timestamp,status,teacherId){
    this.studentId = studentId;
    this.thesisId=thesisId;
    this.timestamp = timestamp;
    this.status=status;
    this.teacherId=teacherId;

}
function Student(id, surname, name, gender, nationality, email, degreeCode, enrollmentYear) {
    this.id = id;
    this.surname = surname;
    this.name = name;
    this.gender = gender;
    this.nationality = nationality;
    this.email = email;
    this.degreeCode = degreeCode;
    this.enrollmentYear = enrollmentYear;
  }

  function Teacher(id, surname, name, email, groupCode, departmentCode) {
    this.id = id;
    this.surname = surname;
    this.name = name;
    this.email = email;
    this.groupCode = groupCode;
    this.departmentCode = departmentCode;
}



module.exports = {ThesisProposal,Application,Student,Teacher};