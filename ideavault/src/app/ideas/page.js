"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import IdeaList from '@/components/IdeaList';
import Container from '@/components/Container';

const IdeasPage = () => {
  const router = useRouter();
  const [ideas, setideas] = useState([])

  const fetchData = async () => {
    try {
      const respData = await fetch("/api/admin/getIdeas")
      const parsedData = await respData.json()
      setideas([...parsedData.data])
      console.log(ideas)

    } catch (error) {
      console.error(error)
      
    }
  }

  useEffect(() => {
    fetchData()
  
    
  }, [])
  

  
  return (
    <Container>
      
    <div className="container min-w-full px-12 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ideas</h1>
        <Button onClick={() => router.push('/ideas/new')}>Add New Idea</Button>
      </div>
      <IdeaList routeIdeas = {ideas}/>
    </div>
    </Container>
  );
};

export default IdeasPage;
