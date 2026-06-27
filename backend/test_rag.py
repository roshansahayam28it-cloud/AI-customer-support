from vector_store import search_documents

questions = [
    "What is LICET?",
    "What is the vision of LICET?",
    "Who collaborates with LICET?",
    "What facilities are available?",
    "Tell me about Information Technology department.",
    "What placements are available?"
]

for question in questions:

    print("\nQUESTION:", question)

    results = search_documents(
        question,
        top_k=3,
        min_score=0.2
    )

    for result in results:

        print("Score:", result["score"])
        print(result["text"])
        print("-" * 50)