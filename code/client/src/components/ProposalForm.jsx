/* eslint-disable react/prop-types */
/* IDEA
    editor accessible from professors in two modes:
    1- INSERT MODE, create a new thesis proposals from scratch -> all field empty
    2- EDIT MODE, modify an existant proposal, existing field should be pre filled with the existing ones
        I assume tin the props there is an object called proposal with all the field already set


    
 */



import { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const ProposalForm = (props) => {
  
    const [title, setTitle] = useState('');
    const [supervisor, setSupervisor] = useState(props.user.name);
    const [cosupervisors, setCosupervisors] = useState(['']);
    const [keywords, setKeywords] = useState('');
    const [type, setType] = useState('');
    const [groups, setGroups] = useState(['']);
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [notes, setNotes] = useState('');
    const [expiration, setExpiration] = useState('');
    const [level, setLevel] = useState('');
    const [cds, setCds] = useState('');

    const [errorMsg, setErrorMsg] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();

        // Esegui la convalida dei dati qui
        const errors = {};

        if (!title || title.trim() === '') {
            errors.title = 'Title is required';
        }

        if (!supervisor || supervisor.trim() === '') {
            errors.supervisor = 'Supervisor is required';
        }

        if (cosupervisors.length === 0) {
            errors.cosupervisors = 'Cosupervisors are required';
        }

        if (!keywords || keywords.trim() === '') {
            errors.keywords = 'Keywords are required';
        }

        if (!type || type.trim() === '') {
            errors.type = 'Type is required';
        }

        if (groups.length === 0) {
            errors.groups = 'one group is required';
        }


        if (!description || description.trim() === '') {
            errors.description = 'Description is required';
        }

        if (!requirements || requirements.trim() === '') {
            errors.requirements = 'Requirements are required';
        }

        if (!notes || notes.trim() === '') {
            errors.notes = 'Notes are required';
        }

        if (!expiration || expiration.trim() === '') {
            errors.expiration = 'Expiration date is required';
        } else {
            const dateParts = expiration.split('-');//format dd-mm-yyyy
            const year = parseInt(dateParts[2]);
            const month = parseInt(dateParts[1]);
            const day = parseInt(dateParts[0]);
            const currentDate = new Date();
            const inputDate = new Date(year, month - 1, day); // month starts from 0
            if (isNaN(inputDate) || inputDate < currentDate) {
                errors.expiration = 'Invalid or past date';
            }
        }

        if (!level || level.trim() === '') {
            errors.level = 'Level is required';
        }

        if (!cds || cds.trim() === '') {
            errors.cds = 'CDS is required';
        }

        if (Object.keys(errors).length !== 0) {
            const errorString = Object.values(errors).join('\n');
            setErrorMsg(errorString);
        } else {
            // Send data
            const proposal = {
                title: title,
                supervisor: supervisor,
                cosupervisors: cosupervisors,
                keywords: keywords,
                type: type,
                groups: groups,
                description: description,
                requirements: requirements,
                notes: notes,
                expiration: expiration,
                level: level,
                cds: cds,
            };
            //maybe call api POST
            //props.setProposal(proposal);
        }
    }


    return (
        <>
            {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title" >
                    <Form.Label column="lg">Title:</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={(props.proposal && props.proposal.title) ? props.proposal.title : title}
                        onChange={ev => setTitle(ev.target.value)}

                    />
                </Form.Group>



                <Form.Group as={Row} className="mb-3 mt-3" controlId="supervisor">
                    <Form.Label column >Supervisor:</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            name="supervisor"
                            value={(props.proposal && props.proposal.supervisor) ? props.proposal.supervisor : supervisor}
                            onChange={ev => setSupervisor(ev.target.value)}
                        />
                    </Col>
                </Form.Group>

                <CosupervisorsForm cosupervisors={cosupervisors} setCosupervisors={setCosupervisors} proposal={props.proposal} />


                <GroupsForm groups={groups} setGroups={setGroups} proposal={props.proposal} />

                <Row>
                    <Col>
                        <Form.Group as={Row} className="mb-3 mt-3" controlId="keywords">
                            <Form.Label column>Keywords:</Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    type="text"
                                    name="keywords"
                                    value={(props.proposal && props.proposal.keywords) ? props.proposal.keywords : keywords}
                                    onChange={ev => setKeywords(ev.target.value)}
                                />
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group as={Row} className="mb-3 mt-3" controlId="type">
                            <Form.Label column>Type:</Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    type="text"
                                    name="type"
                                    value={(props.proposal && props.proposal.type) ? props.proposal.type : type}
                                    onChange={ev => setType(ev.target.value)}
                                />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>


                <Form.Group controlId="description">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={(props.proposal && props.proposal.description) ? props.proposal.description : description}
                        onChange={ev => setDescription(ev.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="requirements">
                    <Form.Label>Requirements:</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="requirements"
                        value={(props.proposal && props.proposal.requirements) ? props.proposal.requirements : requirements}
                        onChange={ev => setRequirements(ev.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="notes">
                    <Form.Label>Notes:</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="notes"
                        value={(props.proposal && props.proposal.notes) ? props.proposal.notes : notes}
                        onChange={ev => setNotes(ev.target.value)}
                    />
                </Form.Group>

                <Row>
                    <Col>
                        <Form.Group as={Row} className="mb-3 mt-3" controlId="level">
                            <Form.Label column>Level:</Form.Label>
                            <Col sm={10}>
                                <Form.Select value={level} onChange={ev => setLevel(ev.target.value)}>
                                    <option>select the level</option>
                                    <option value="bachelor">bachelor</option>
                                    <option value="master">master</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group as={Row} className="mb-3 mt-3" controlId="cds">
                            <Form.Label column>CDS:</Form.Label>
                            <Col sm={10}>
                                <Form.Control
                                    type="text"
                                    name="cds"
                                    value={(props.proposal && props.proposal.cds) ? props.proposal.cds : cds}
                                    onChange={ev => setCds(ev.target.value)}
                                />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group controlId="expiration">
                    <Form.Label>Expiration:</Form.Label>
                    <Row>
                        <Col>
                            <DatePicker
                                value={(props.proposal && props.proposal.expiration) ? props.proposal.expiration : expiration}
                                onChange={(date) => {
                                    const yyyy = date.getFullYear();
                                    let mm = date.getMonth() + 1; // Months start at 0!
                                    let dd = date.getDate();
                                    const formattedDate = dd + '-' + mm + '-' + yyyy;
                                    setExpiration(formattedDate);
                                }}

                                dateFormat="dd/MM/yyyy"  // Puoi personalizzare il formato della data
                            />
                        </Col>
                    </Row>
                </Form.Group>


                <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                    Submit
                </Button>


            </Form>


        </>
    );
}


function GroupsForm({ groups, setGroups, proposal }) {

    if (proposal && proposal.groups) {
        const list = proposal.groups.split(",");
        setGroups(list);
    }

    const addGroup = () => {
        setGroups([...groups, '']); // Add a new empty field for groups
    };

    const handleGroupChange = (index, value) => {
        const updatedGroups = [...groups];
        updatedGroups[index] = value;
        setGroups(updatedGroups);
    };

    return (
        <>
            {groups.map((group, index) => (
                <Form.Group as={Row} className="mb-3 mt-3" controlId={`groups-${index}`} key={index}>
                    <Form.Label column>Group {index + 1}:</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            value={group}
                            onChange={(e) => handleGroupChange(index, e.target.value)}
                        />
                    </Col>
                </Form.Group>
            ))}

            <Button variant="secondary" onClick={addGroup}>
                Add Group
            </Button>
        </>
    );
}


function CosupervisorsForm({ cosupervisors, setCosupervisors, proposal }) {

    if (proposal && proposal.cosupervisors) {
        const list = proposal.cosupervisors.split(",");
        setCosupervisors(list);
    }

    const addCosupervisor = () => {
        setCosupervisors([...cosupervisors, '']); // Aggiungi un nuovo campo vuoto per i cosupervisori
    };

    const handleCosupervisorChange = (index, value) => {
        const updatedCosupervisors = [...cosupervisors];
        updatedCosupervisors[index] = value;
        setCosupervisors(updatedCosupervisors);
    };

    return (
        <>
            {cosupervisors.map((cosupervisor, index) => (
                <Form.Group as={Row} className="mb-3 mt-3" controlId={`cosupervisors-${index}`} key={index}>
                    <Form.Label column>Cosupervisor {index + 1}:</Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            value={cosupervisor}
                            onChange={(e) => handleCosupervisorChange(index, e.target.value)}
                        />
                    </Col>
                </Form.Group>
            ))}

            <Button variant="secondary" onClick={addCosupervisor}>
                Aggiungi Cosupervisor
            </Button>
        </>
    );
}

export default ProposalForm;