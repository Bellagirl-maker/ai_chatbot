module Admin
  class SupportArticlesController < ApplicationController
    before_action :authenticate_admin_user!
    before_action :set_company

    def index
      articles = @company.support_articles

      render json: {
        articles: articles,
        plan: @company.plan,
        article_limit: @company.article_limit,
        articles_used: @company.articles_used
      }
    end

    def create
      unless @company.can_add_article?
        render json: { error: "Article limit reached" }, status: :payment_required
        return
      end

      article = @company.support_articles.create!(
        support_article_params
      )

      render json: article, status: :created
    end

    def destroy
      article = @company.support_articles.find(params[:id])
      article.destroy

      head :no_content
    end

    private

    def set_company
      @company = current_admin_user.company
    end

    def support_article_params
      params.require(:support_article).permit(:question, :answer)
    end
  end
end
