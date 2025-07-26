'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useHydration } from '../hooks/useHydration';
import useFormValidation from '../hooks/useFormValidation';
import {
  DialogRoot,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogCloseTrigger,
  Button,
  FieldRoot,
  FieldLabel,
  Input,
  Box,
  Text,
  Flex,
  VStack,
} from '@chakra-ui/react';

interface UserInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isBlocking: boolean;
}

export default function UserInfoDialog({ isOpen, onClose, isBlocking }: UserInfoDialogProps) {
  const { user, setUser } = useUser();
  const [editing, setEditing] = useState(false);
  const isHydrated = useHydration();

  // Initialize form validation hooks
  const {
    data: formData,
    updateField,
    validationResults,
    touched,
    markFieldAsTouched,
    markAllAsTouched,
    isValid,
  } = useFormValidation(
    { username: user?.username || '', jobTitle: user?.job || '' },
    true // validate on change
  );

  // Save user info
  const handleSave = () => {
    markAllAsTouched();
    
    if (isValid) {
      const info = { username: formData.username, job: formData.jobTitle };
      setUser(info);
      setEditing(false);
      onClose();
    }
  };

  // Handle body scroll locking when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Set editing to true when dialog opens for non-blocking mode
      if (!isBlocking && user) {
        setEditing(true);
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isBlocking, user]); // Include user in dependencies

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={9998}
          onClick={() => {
            if (user && editing && !isBlocking) {
              setEditing(false);
              onClose();
            }
          }}
        />
      )}
      
      {/* Blocking Dialog */}
      <DialogRoot open={isOpen} onOpenChange={open => { if (!open) return; }}>
        <DialogContent 
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            margin: 0
          }}
          p={6}
        >
          <DialogTitle color="gray.800" mb={4}>
            {editing || !user ? 'Enter your info' : 'Edit your info'}
          </DialogTitle>
          
          {/* Close button only if not blocking */}
          {user && editing && !isBlocking && (
            <DialogCloseTrigger asChild>
              <Button 
                onClick={() => { 
                  setEditing(false); 
                  onClose(); 
                }} 
                size="sm" 
                variant="ghost" 
                colorScheme="gray" 
                ml={4}
                aria-label="Close dialog"
              >
                ✕
              </Button>
            </DialogCloseTrigger>
          )}
          
          <DialogDescription asChild={false}>
            <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <VStack gap={4} align="stretch">
                <FieldRoot required>
                  <FieldLabel mb={2} color="gray.700" fontWeight="medium">
                    Username
                  </FieldLabel>
                  <Input
                    value={formData.username}
                    onChange={e => {
                      updateField('username', e.target.value);
                      markFieldAsTouched('username');
                    }}
                    onBlur={() => markFieldAsTouched('username')}
                    placeholder="Enter your username"
                    autoFocus
                    aria-invalid={touched.username && !validationResults.username?.isValid}
                  />
                  {touched.username && validationResults.username?.errors.length > 0 && (
                    <Text fontSize="sm" color="red.500" mt={1}>
                      {validationResults.username.errors[0]}
                    </Text>
                  )}
                </FieldRoot>

                <FieldRoot required>
                  <FieldLabel mb={2} color="gray.700" fontWeight="medium">
                    Job Title
                  </FieldLabel>
                  <Input
                    value={formData.jobTitle}
                    onChange={e => {
                      updateField('jobTitle', e.target.value);
                      markFieldAsTouched('jobTitle');
                    }}
                    onBlur={() => markFieldAsTouched('jobTitle')}
                    placeholder="Enter your job title"
                    aria-invalid={touched.jobTitle && !validationResults.jobTitle?.isValid}
                  />
                  {touched.jobTitle && validationResults.jobTitle?.errors.length > 0 && (
                    <Text fontSize="sm" color="red.500" mt={1}>
                      {validationResults.jobTitle.errors[0]}
                    </Text>
                  )}
                </FieldRoot>

                <Flex mt={4} justify="flex-end" gap={2}>
                  {!isBlocking && (
                    <Button 
                      variant="outline" 
                      colorScheme="gray" 
                      onClick={() => { 
                        setEditing(false); 
                        onClose(); 
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    colorScheme="teal" 
                    type="submit" 
                    disabled={!isValid}
                  >
                    Save
                  </Button>
                </Flex>
              </VStack>
            </form>
          </DialogDescription>
        </DialogContent>
      </DialogRoot>
    </>
  );
} 