"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, FileText, Key, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react"
import Header from "@/components/header"
import { MotionDiv, MotionH1, MotionP } from "@/components/motion"

export default function SolutionsPage() {
  const encryptionProcesses = [
    {
      title: "Text Encryption",
      icon: FileText,
      description: "Secure your sensitive messages and text data",
      steps: [
        {
          title: "Input Processing",
          description: "Your text is first converted into a standardized format and prepared for encryption.",
          icon: ArrowRight
        },
        {
          title: "Key Generation",
          description: "A unique encryption key is generated using our quantum-resistant algorithm.",
          icon: Key
        },
        {
          title: "Encryption",
          description: "Your text is encrypted using Vigenere Cipher encryption, the industry standard for data security.",
          icon: Lock
        },
        {
          title: "Secure Storage",
          description: "The encrypted text is stored with additional security layers and can only be accessed with your private key.",
          icon: Shield
        }
      ],
      decryptionSteps: [
        {
          title: "Key Verification",
          description: "Your private key is verified to ensure secure access to the encrypted data.",
          icon: Key
        },
        {
          title: "Decryption Process",
          description: "The encrypted text is decrypted using the verified key and Vigenere Cipher algorithm.",
          icon: RefreshCw
        },
        {
          title: "Output Generation",
          description: "The decrypted text is processed and presented to you in its original format.",
          icon: ArrowLeft
        }
      ]
    },
    {
      title: "File Encryption",
      icon: Lock,
      description: "Protect your files with military-grade encryption",
      steps: [
        {
          title: "File Analysis",
          description: "Your file is analyzed for size, type, and content to determine the optimal encryption method.",
          icon: ArrowRight
        },
        {
          title: "Key Generation",
          description: "A unique file-specific encryption key is generated using our advanced key management system.",
          icon: Key
        },
        {
          title: "Chunk Processing",
          description: "Large files are processed in secure chunks to ensure efficient and reliable encryption.",
          icon: RefreshCw
        },
        {
          title: "Encryption",
          description: "Each chunk is encrypted using AES-256 encryption with additional security layers.",
          icon: Lock
        },
        {
          title: "Secure Storage",
          description: "The encrypted file is stored with metadata protection and can only be accessed with your private key.",
          icon: Shield
        }
      ],
      decryptionSteps: [
        {
          title: "Key Verification",
          description: "Your private key is verified to ensure secure access to the encrypted file.",
          icon: Key
        },
        {
          title: "Chunk Decryption",
          description: "The encrypted file is processed in chunks and decrypted using the verified key.",
          icon: RefreshCw
        },
        {
          title: "File Reconstruction",
          description: "The decrypted chunks are reassembled into the original file format.",
          icon: ArrowLeft
        },
        {
          title: "Integrity Check",
          description: "The decrypted file is verified to ensure it matches the original file's integrity.",
          icon: Shield
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container py-20">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <MotionH1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl font-light mb-6"
            >
              How Our Encryption Works
            </MotionH1>
            <MotionP
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl text-white/60 max-w-3xl mx-auto"
            >
              Learn about our military-grade encryption processes for both text and files.
              Built with security and reliability in mind.
            </MotionP>
          </div>

          <div className="space-y-16">
            {encryptionProcesses.map((process, index) => (
              <MotionDiv
                key={process.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.6 }}
              >
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-white/10 rounded-lg">
                        <process.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-light">{process.title}</CardTitle>
                        <CardDescription className="text-white/60">{process.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Encryption Process */}
                      <div>
                        <h3 className="text-xl font-light mb-6 text-white/80">Encryption Process</h3>
                        <div className="space-y-6">
                          {process.steps.map((step, stepIndex) => (
                            <div key={step.title} className="flex gap-4">
                              <div className="p-2 bg-white/10 rounded-lg h-fit">
                                <step.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-medium text-white/90 mb-1">{step.title}</h4>
                                <p className="text-white/60 text-sm">{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Decryption Process */}
                      <div>
                        <h3 className="text-xl font-light mb-6 text-white/80">Decryption Process</h3>
                        <div className="space-y-6">
                          {process.decryptionSteps.map((step, stepIndex) => (
                            <div key={step.title} className="flex gap-4">
                              <div className="p-2 bg-white/10 rounded-lg h-fit">
                                <step.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-medium text-white/90 mb-1">{step.title}</h4>
                                <p className="text-white/60 text-sm">{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>
      </main>
    </div>
  )
} 