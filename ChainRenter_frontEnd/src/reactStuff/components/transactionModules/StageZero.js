import React, { Component } from 'react';
import { Dropdown, DropdownButton, Popover, Badge, Button, Row, Col, Form, Container, Image, ListGroup, OverlayTrigger } from 'react-bootstrap';

import failed from '../../../imgs/failed.png';

export const StageZero = (props) => {
    let tempVal = 'nothing';
    return (
 
      <div className="justify-content-md-center timerr">
            <Image src={failed} />
            <h5 className="text-center">Rental has been cancelled or failed.</h5>
        </div>
    )
  }