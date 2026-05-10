"use client"

import RegisterForm from '@/components/auth/RegisterForm'
import Welcome from '@/components/auth/Welcome'
import React, { useState } from 'react'

const Register = () => {
    const [step,setStep]=useState(1)
  return (
    <div>
        {step === 1 ? <Welcome nextStep={setStep}/>: <RegisterForm previousStep={setStep}/>}
    </div>
  )
}

export default Register