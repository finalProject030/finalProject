function GeminiResponse({ response }) {
  return (
    <div className="gemini-response">
      <pre>{response}</pre>
      <style jsx>{`
        .gemini-response {
          background-color: #f0f0f0;
          padding: 20px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .gemini-response pre {
          white-space: pre-line; /* Preserve line breaks */
          font-size: 16px;
          line-height: 1.5;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
