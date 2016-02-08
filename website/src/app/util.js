import React from 'react'

export const wait = ms => new Promise((resolve, reject) => setTimeout(() => resolve(), ms))

export const row = (a, b) => <div className='row'>
  <div className='title col-sm-3'> {a} </div>
  <div className='value col-sm-9'> {b} </div>
</div>
