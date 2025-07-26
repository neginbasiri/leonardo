'use client';

import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import UserInfoDialog from './UserInfoDialog';

export default function EditUserButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        size="sm"
        onClick={handleEdit}
        aria-label="Edit user information"
        colorScheme="white"
        variant="solid"
        px={4}
        py={2}
        borderRadius="md"
        fontWeight="medium"
        _hover={{ opacity: 0.8 }}
        _active={{ transform: 'scale(0.95)' }}
      >
        Edit
      </Button>
      
      <UserInfoDialog 
        isOpen={isDialogOpen}
        onClose={handleClose}
        isBlocking={false}
        onEdit={() => setIsDialogOpen(true)}
      />
    </>
  );
} 