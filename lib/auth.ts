import { supabase } from "./supabase"

export async function signUp(email: string, password: string, name: string, phoneNumber: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          phone_number: phoneNumber,
        },
      },
    })

    if (error) throw error

    // Jika user langsung confirmed, buat profile manual
    if (data.user && data.user.email_confirmed_at) {
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email,
        name,
        phone_number: phoneNumber,
      })

      if (profileError) {
        console.error("Profile creation error:", profileError)
      }
    }

    return data
  } catch (error) {
    console.error("SignUp error:", error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}
