import React, { Component, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import $ from 'jquery';
import { render } from '@testing-library/react';
import { Modal, Button  } from 'react-bootstrap';

export class NewScheduleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
    }
    this.handleModalHide = this.handleModalHide.bind(this);
  }
  hideModal () {
    
  }
  handleModalHide() {
    console.log("check modal")
      // this.setState({modalShow: false}, function() {
      //   console.log(this.state.modalShow,"modal show")
      // })
      this.state.modalShow = false;
      console.log(this.state.modalShow,"modal show")
  }
  // componentDidUpdate() {
  //   console.log(this.props,"props")
  //   // this.setState({modalShow: this.props.show})
  //   this.close()
  // }
  render() {
    // this.setState({modalShow: this.props.show});
    // console.log(this.props)
    this.state.modalShow = this.props.show
    
      return (
        <Modal 
          show={this.state.modalShow}
          onHide={this.hideModal} 
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton onClick={ ()=> this.handleModalHide()}>Hi</Modal.Header>
          <Modal.Body>asdfasdf</Modal.Body>
          <button>Update</button>
          <button onClick={this.handleModalHide}>Delete</button>
          <Modal.Footer>This is the footer</Modal.Footer>
        </Modal>
      );

  }

}