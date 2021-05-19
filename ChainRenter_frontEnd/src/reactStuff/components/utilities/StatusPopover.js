import React, { Component } from 'react';
import { Popover, OverlayTrigger,Button } from 'react-bootstrap';

const StatusPopover = (props) => {
    return (
        <OverlayTrigger trigger="focus" placement="right" overlay={<Popover id="popover-basic" >
            <Popover.Title as="h3"><strong>Key: </strong> </Popover.Title>
            <Popover.Content>

                <strong>1. Initiated:</strong> Borrower has send owner request. Now awaiting owner's response.  <br />
                <strong>2. Pending:</strong>  Owner accepted. Now awaiting borrower's final signature.  <br />
                <strong>3. Tentative Handshake:</strong> Price, timing and details are agreed to. Now wwaiting contract to go live on blockchain.  <br />
                <strong>4. Contract Ready Blockchain:</strong> Contract ready on blockchain. Proceed to meet up at specified location and time to handoff item.  <br />
                <strong>5. Contract Started:</strong>  Owner and borrower are in the process of handing off item. Awaiting users's acknowledgement of handoff to go into blockchain. Also waiting on borrowers payment of rental price and deposit to go through. <br />
                <strong>6. Payment Complete / Item Now with Borrower:</strong>  Handoff is offical on blockchain and payment has gone through. Borrower now possesses item for duration of agreed upon contract. Each party is free to go.  <br />

                <strong>7. Rental Complete / Item Now Back with Owner:</strong>  Users have met up. Item has been returned to owner and each user has acknowledged completion of rental on blockchain. <br />
                <strong>911. Rental Failed:</strong>  Rental has been cancelled or failed

             </Popover.Content>
            </Popover>}>
            <Button className="lil-margin-left" variant="outline-info" size="sm">?</Button>
        </OverlayTrigger>

    )
}

export default StatusPopover;