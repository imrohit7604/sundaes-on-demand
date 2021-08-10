import SummaryForm from '../SummaryForm';
const { render, screen, fireEvent } = require("@testing-library/react")

test("inital condition", () => {
    render(<SummaryForm />)
    const checkbox = screen.getByRole("checkbox", { name: /terms and condition/i })
    const confirmButton = screen.getByRole("button", { name: /confirm order/i })
    expect(confirmButton).toBeDisabled()
    expect(checkbox).not.toBeChecked()

})

test("checkbox enables button on first click and disable on select click", () => {
    render(<SummaryForm/>)
    const checkbox = screen.getByRole("checkbox", { name: /terms and condition/i })
    const confirmButton = screen.getByRole("button", { name: /confirm order/i })

    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(confirmButton).toBeEnabled()

    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
    expect(confirmButton).toBeDisabled()
})