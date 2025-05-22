"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { AuthProvider } from "@/context/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { describe, it, expect, jest } from "@jest/globals"

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    }
  },
}))

// Example test for LoginForm
describe("LoginForm", () => {
  it("renders login form correctly", () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </ThemeProvider>,
    )

    expect(screen.getByText("DocuQuery AI")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument()
  })

  it("validates form inputs", () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </ThemeProvider>,
    )

    const signInButton = screen.getByRole("button", { name: "Sign In" })
    expect(signInButton).toBeDisabled()

    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    expect(signInButton).toBeDisabled()

    fireEvent.change(passwordInput, { target: { value: "password" } })
    expect(signInButton).not.toBeDisabled()
  })
})

// Example test for SignupForm
describe("SignupForm", () => {
  it("renders signup form correctly", () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <SignupForm />
        </AuthProvider>
      </ThemeProvider>,
    )

    expect(screen.getByText("DocuQuery AI")).toBeInTheDocument()
    expect(screen.getByLabelText("Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument()
  })

  it("validates form inputs", () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <SignupForm />
        </AuthProvider>
      </ThemeProvider>,
    )

    const signUpButton = screen.getByRole("button", { name: "Sign Up" })
    expect(signUpButton).toBeDisabled()

    const nameInput = screen.getByLabelText("Name")
    const emailInput = screen.getByLabelText("Email")
    const passwordInput = screen.getByLabelText("Password")
    const confirmPasswordInput = screen.getByLabelText("Confirm Password")

    fireEvent.change(nameInput, { target: { value: "Test User" } })
    expect(signUpButton).toBeDisabled()

    fireEvent.change(emailInput, { target: { value: "test@example.com" } })
    expect(signUpButton).toBeDisabled()

    fireEvent.change(passwordInput, { target: { value: "password" } })
    expect(signUpButton).toBeDisabled()

    fireEvent.change(confirmPasswordInput, { target: { value: "password" } })
    expect(signUpButton).not.toBeDisabled()
  })
})

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>This page contains test examples for the application.</p>
    </div>
  )
}
