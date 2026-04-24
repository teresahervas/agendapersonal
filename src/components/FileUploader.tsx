'use client'

import React, { useState } from 'react'
import { Upload, X, File, Image as ImageIcon } from 'lucide-react'
import { Button } from './ui/Button'
import { createClient } from '@/utils/supabase/client'

interface FileUploaderProps {
  onUpload: (url: string) => void
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const supabase = createClient()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar un archivo para subir.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath)

      onUpload(data.publicUrl)
      setPreview(data.publicUrl)
    } catch (error) {
      alert('Error subiendo archivo!')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl hover:bg-muted/50 cursor-pointer transition-all border-muted">
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground font-medium">
            {uploading ? 'Subiendo...' : 'Añadir imagen o archivo'}
          </span>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleUpload} 
            disabled={uploading}
            accept="image/*,.pdf,.doc,.docx"
          />
        </label>
      </div>

      {preview && (
        <div className="relative w-24 h-24 rounded-xl overflow-hidden border group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button 
            onClick={() => setPreview(null)}
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      )}
    </div>
  )
}
