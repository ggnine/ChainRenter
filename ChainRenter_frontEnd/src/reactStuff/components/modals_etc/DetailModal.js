import React, { Component, useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

const DetailModal = (props) => {
  const [show, setShow] = useState(true);
  console.log("ds", props.props);
  var history = props.props.history;


  const handleClose = (e) => {
    setShow(false);
    console.log(history);
    try {
        if (e.target.id === "myTransactions") {
          history.push('/transactions');

        } else {
          history.push('/');

        }
      
    } catch (err){
        console.log("errrr",err);
        // history.push('/');
    }
  };
  const handleShow = () => setShow(true);

  return (
    <div>


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Congrats, You've made your request! Expect a response soon from the lister.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" id="myTransactions" onClick={handleClose}>
            My Transactions
          </Button>
          <Button variant="primary" id="home" onClick={handleClose}>
            Home
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default DetailModal;