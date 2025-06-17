import { supabase } from "./supabase-client"

export class SupabaseStorage {
  private static readonly BUCKET_NAME = "encrypted-files"

  static async uploadEncryptedFile(
    file: Blob,
    fileName: string,
    userId: string,
  ): Promise<{ url: string; path: string }> {
    if (!supabase) {
      throw new Error("Supabase is not configured. File upload is not available.")
    }

    const filePath = `${userId}/${Date.now()}-${fileName}`

    const { data, error } = await supabase.storage.from(this.BUCKET_NAME).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    const { data: urlData } = supabase.storage.from(this.BUCKET_NAME).getPublicUrl(filePath)

    return {
      url: urlData.publicUrl,
      path: filePath,
    }
  }

  static async downloadFile(filePath: string): Promise<Blob> {
    if (!supabase) {
      throw new Error("Supabase is not configured. File download is not available.")
    }

    const { data, error } = await supabase.storage.from(this.BUCKET_NAME).download(filePath)

    if (error) throw error
    return data
  }

  static async deleteFile(filePath: string): Promise<void> {
    if (!supabase) {
      throw new Error("Supabase is not configured. File deletion is not available.")
    }

    const { error } = await supabase.storage.from(this.BUCKET_NAME).remove([filePath])

    if (error) throw error
  }

  static async logEncryption(
    userId: string,
    fileName: string,
    operation: "encrypt" | "decrypt",
    fileSize: number,
  ): Promise<void> {
    if (!supabase) {
      console.warn("Supabase is not configured. Encryption logging is not available.")
      return
    }

    const { error } = await supabase.from("encryption_logs").insert({
      user_id: userId,
      file_name: fileName,
      operation,
      file_size: fileSize,
    })

    if (error) {
      console.error("Failed to log encryption:", error)
    }
  }

  static async getUserEncryptionHistory(userId: string) {
    if (!supabase) {
      console.warn("Supabase is not configured. Encryption history is not available.")
      return []
    }

    const { data, error } = await supabase
      .from("encryption_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Failed to fetch encryption history:", error)
      return []
    }
    return data || []
  }
}
