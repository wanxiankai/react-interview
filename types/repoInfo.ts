export type Repository = {
    id: string
    name: string
    full_name: string
    open_issues_count: number
    stargazers_count: number
    forks_count: number
    html_url:string
    url: string
    language: string
    owner: {
      login: string
      avatar_url: string
    }
  }
  
  export type APIResponse = { items: Repository[] }