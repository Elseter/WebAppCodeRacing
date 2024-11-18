public class SumOfEvens {

    // User needs to implement this method
    

    public static void main(String[] args) {
        // Predefined test cases
        System.out.println("Running tests for SumOfEvens...");

        try {
            testSumOfEvens(10, 30);
            testSumOfEvens(5, 6);
            testSumOfEvens(0, 0);
            testSumOfEvens(1, 2);

            System.out.println("All tests passed!");
        } catch (AssertionError e) {
            System.err.println(e.getMessage());
        }
    }

    // Helper method for testing
    private static void testSumOfEvens(int input, int expected) {
        int result = sumOfEvens(input);
        if (result != expected) {
            throw new AssertionError("Test failed for input: " + input + 
                ". Expected: " + expected + ", Got: " + result);
        }
    }
}