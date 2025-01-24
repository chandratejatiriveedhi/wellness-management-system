                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(user.id);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConsult(user);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Consult
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {message && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}
    </div>
  );
}