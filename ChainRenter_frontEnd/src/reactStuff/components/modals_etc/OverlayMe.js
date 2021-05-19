
import React, { Component } from 'react';

import { Popover } from 'react-bootstrap';

// const OverlayMe = React.forwardRef((props, ref) => (
//     <div
//       // {...props}
//       // style={{
//       //   backgroundColor: 'rgba(0, 0, 0, 0.85)',
//       //   padding: '2px 10px',
//       //   color: 'white',
//       //   borderRadius: 3,
//       //   ...props.style,
//       // }}
//     >
//       Simple tooltip
//     </div>
//   ));

class OverlayMe extends Component {
  render() {
  return(
    
  <Popover id = "popover-basic" >
      <Popover.Title as="h3">Popover right</Popover.Title>
      <Popover.Content>
        And here's some <strong>amazing</strong> content. It's very engaging.
        right?
  </Popover.Content>
  </Popover>
)}};

export default OverlayMe;