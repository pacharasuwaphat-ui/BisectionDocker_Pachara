import React from 'react'
import { useState } from 'react'
import { det, i, size  } from "mathjs";
import Graph from '../component/Graph';
import Table from '../component/TableIteration'
import axios from "axios"; 
import Nav from './Menu'
import './UI.css'

function inversion() {
  return (
    <>
        <Nav current={'inversion'}></Nav>
    </>
  )
}

export default inversion